import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, dto: { orderId: string; rating: number; comment?: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { review: true },
    });

    if (!order || order.userId !== user.id) {
      throw new NotFoundException('Order not found or access denied.');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new ForbiddenException('You can only review completed orders.');
    }
    if (order.review) {
      throw new ForbiddenException('This order has already been reviewed.');
    }
    
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId: user.id,
        outletId: order.outletId,
        orderId: order.id,
      },
    });
  }

  async findForVendor(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet.');
    }
    return this.prisma.review.findMany({
      where: { outletId: vendor.outletId },
      include: { user: { select: { profile: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}