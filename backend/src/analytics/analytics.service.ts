import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboardStats() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const todaysOrdersAgg = await this.prisma.order.aggregate({
      _count: { id: true },
      _sum: { total: true },
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    });

    const totalRevenueAgg = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'COMPLETED' },
    });

    const pendingOrdersCount = await this.prisma.order.count({
      where: { status: 'PENDING' },
    });

    return {
      todaysOrdersCount: todaysOrdersAgg._count.id || 0,
      todaysOrdersValue: todaysOrdersAgg._sum.total || 0,
      totalRevenue: totalRevenueAgg._sum.total || 0,
      pendingOrders: pendingOrdersCount,
    };
  }

  async getSalesOverTime(days: number) {
    const startDate = startOfDay(subDays(new Date(), days - 1));

    const sales = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailySales = new Map<string, number>();
    sales.forEach((sale) => {
      const day = sale.createdAt.toISOString().split('T')[0];
      const currentSales = dailySales.get(day) || 0;
      dailySales.set(day, currentSales + (sale._sum.total || 0));
    });

    const dateMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), i);
      const dayString = date.toISOString().split('T')[0];
      dateMap.set(dayString, dailySales.get(dayString) || 0);
    }

    const sortedSales = Array.from(dateMap, ([date, revenue]) => ({
      date,
      revenue,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedSales;
  }

  async getTopSellingItems() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const topItems = await this.prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
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
      take: 5,
    });

    const itemIds = topItems.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true },
    });
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item.name]));

    return topItems.map((item) => ({
      name: menuItemMap.get(item.menuItemId) || 'Unknown Item',
      quantitySold: item._sum.quantity,
    }));
  }
}
