import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Coupon, OrderStatus, PaymentMode, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private razorpay: RazorpayService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- ADMIN METHODS ---
  async findAllForAdmin(options: { where?: Prisma.OrderWhereInput }) {
    const orders = await this.prisma.order.findMany({
      where: options.where,
      include: {
        user: { select: { email: true, profile: true } },
        outlet: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const totalCount = await this.prisma.order.count({ where: options.where });
    return { orders, totalCount };
  }

  async findOneForAdmin(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { email: true, profile: true } },
        outlet: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatusForAdmin(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  // --- CUSTOMER METHODS ---
  async placeOrder(user: User, dto: CreateOrderDto) {
    if (user.isBlocked) {
      throw new ForbiddenException('Account is blocked due to an unpaid penalty.');
    }
    const menuItemIds = dto.items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, outletId: dto.outletId, isAvailable: true },
    });
    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('Some menu items are invalid or unavailable.');
    }
    const menuItemsMap = new Map(menuItems.map(item => [item.id, item]));
    let total = 0;
    for (const item of dto.items) {
      total += menuItemsMap.get(item.menuItemId)!.price * item.quantity;
    }
    let validCoupon: Coupon | null = null;
    if (dto.couponCode) {
      validCoupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode.toUpperCase() },
      });
      if (!validCoupon || !validCoupon.isActive || (validCoupon.expiresAt && validCoupon.expiresAt < new Date())) {
        throw new BadRequestException('Invalid or expired coupon code.');
      }
    }
    let discountAmount = 0;
    if (validCoupon) {
      discountAmount = total * (validCoupon.discountPercentage / 100);
      total = total - discountAmount;
    }
    return this.prisma.$transaction(async (tx) => {
      const slotTime = new Date(dto.slotTime);
      const outlet = await tx.outlet.findUnique({ where: { id: dto.outletId } });
      if (!outlet) throw new NotFoundException('Outlet not found');
      const existingOrdersCount = await tx.order.count({
        where: { outletId: dto.outletId, slotTime: slotTime },
      });
      if (existingOrdersCount >= outlet.maxOrdersPerSlot) {
        throw new ConflictException('Selected time slot is full.');
      }
      const initialStatus = dto.paymentMode === PaymentMode.COD 
        ? OrderStatus.CONFIRMED 
        : OrderStatus.PENDING;
      let razorpayOrder: any = null; 
      if (dto.paymentMode === PaymentMode.PREPAID && total > 0) {
        try {
          razorpayOrder = await this.razorpay.createOrder(total, `rcpt_${new Date().getTime()}`);
        } catch (error) {
          throw new InternalServerErrorException('Failed to create payment order.');
        }
      }
      const order = await tx.order.create({
        data: {
          total: total,
          status: initialStatus,
          paymentMode: dto.paymentMode,
          slotTime: slotTime,
          userId: user.id,
          outletId: dto.outletId,
          razorpayOrderId: razorpayOrder?.id,
          discountAmount: discountAmount > 0 ? discountAmount : null,
          couponId: validCoupon?.id,
          items: {
            create: dto.items.map((item) => ({
              quantity: item.quantity,
              priceAtTimeOfOrder: menuItemsMap.get(item.menuItemId)!.price,
              menuItemId: item.menuItemId,
            })),
          },
        },
      });
      if (order.status === 'CONFIRMED') {
        this.eventsGateway.server.to(order.outletId).emit('newOrder', order);
      }
      return { ...order, razorpayOrderDetails: razorpayOrder };
    });
  }

  findForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        review: true,
        outlet: { select: { name: true } },
      },
    });
  }
}