import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  async getOrdersToPrepare(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }

    // Define how long it takes to prepare an order (e.g., 15 minutes)
    const preparationLeadTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    const now = new Date();
    const preparationCutoffTime = new Date(now.getTime() + preparationLeadTime);

    // Fetch confirmed orders for the vendor's outlet
    // whose pickup slot is within the next 15 minutes.
    const orders = await this.prisma.order.findMany({
      where: {
        outletId: vendor.outletId,
        status: OrderStatus.CONFIRMED,
        slotTime: {
          gte: now,
          lte: preparationCutoffTime,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        items: {
          include: {
            menuItem: true, // Include details about the menu item
          },
        },
      },
      orderBy: {
        slotTime: 'asc', // Show the earliest orders first
      },
    });

    return orders;
  }
}