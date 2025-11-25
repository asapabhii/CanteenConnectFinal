import { Injectable, ForbiddenException } from '@nestjs/common';
import { OrderStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class VendorAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getVendorDashboardStats(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const outletId = vendor.outletId;

    const salesResult = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        outletId,
        status: 'COMPLETED',
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    const ordersToday = await this.prisma.order.count({
      where: { outletId, createdAt: { gte: todayStart, lte: todayEnd } },
    });

    const activeOrders = await this.prisma.order.count({
      where: {
        outletId,
        status: { in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'] },
      },
    });

    const popularItems = await this.prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          outletId,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 1,
    });

    let mostPopularItem = 'N/A';
    if (popularItems.length > 0) {
      const topItemId = popularItems[0].menuItemId;
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: topItemId },
        select: { name: true },
      });
      mostPopularItem = menuItem?.name || 'N/A';
    }

    return {
      todaysSales: salesResult._sum.total || 0,
      todaysOrders: ordersToday,
      liveActiveOrders: activeOrders,
      mostPopularItem: mostPopularItem,
    };
  }

  async getVendorEarningsReport(
    vendor: User,
    startDate?: Date,
    endDate?: Date,
  ) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const outletId = vendor.outletId;
    const dateFilter =
      startDate && endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const aggregates = await this.prisma.order.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { outletId, status: 'COMPLETED', ...dateFilter },
    });

    const paymentBreakdown = await this.prisma.order.groupBy({
      by: ['paymentMode'],
      _sum: { total: true },
      where: { outletId, status: 'COMPLETED', ...dateFilter },
    });

    const detailedOrders = await this.prisma.order.findMany({
      where: { outletId, status: 'COMPLETED', ...dateFilter },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalRevenue: aggregates._sum.total || 0,
      totalOrders: aggregates._count.id || 0,
      breakdown: paymentBreakdown,
      orders: detailedOrders,
    };
  }
}
