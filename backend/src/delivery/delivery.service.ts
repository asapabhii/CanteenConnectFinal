import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class DeliveryService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async getActiveOrders(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    return this.prisma.order.findMany({
      where: {
        outletId: vendor.outletId,
        status: {
          in: ['PREPARING', 'READY_FOR_PICKUP'],
        },
      },
      include: {
        user: { select: { profile: { select: { name: true } }, email: true } },
        items: {
          include: {
            menuItem: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateOrderStatus(
    vendor: User,
    orderId: string,
    newStatus: OrderStatus,
  ) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.outletId !== vendor.outletId) {
      throw new NotFoundException('Order not found or access denied');
    }
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    
    // Emit to vendor's outlet room
    this.eventsGateway.server.to(updatedOrder.outletId).emit('orderUpdate', updatedOrder);
    // Emit to the specific customer's room
    this.eventsGateway.server.to(updatedOrder.userId).emit('orderUpdate', updatedOrder);

    return updatedOrder;
  }

  async cancelOrder(vendor: User, orderId: string) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order || order.outletId !== vendor.outletId) {
      throw new NotFoundException('Order not found or access denied');
    }
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new ForbiddenException(`Cannot cancel an order with status: ${order.status}`);
    }
    const cancelledOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    // Emit to vendor's outlet room
    this.eventsGateway.server.to(cancelledOrder.outletId).emit('orderUpdate', cancelledOrder);
    // Emit to the specific customer's room
    this.eventsGateway.server.to(cancelledOrder.userId).emit('orderUpdate', cancelledOrder);
    
    return cancelledOrder;
  }
}