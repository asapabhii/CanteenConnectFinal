import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus, PaymentMode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  // For testing, this runs every minute. In production, you'd use CronExpression.EVERY_DAY_AT_11_PM
  @Cron(CronExpression.EVERY_MINUTE)
  async handleEodCodPenalties() {
    this.logger.log('Running End-of-Day COD Penalty Job...');

    const uncollectedOrders = await this.prisma.order.findMany({
      where: {
        paymentMode: PaymentMode.COD,
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
        // Find orders for slots that have already passed
        slotTime: {
          lt: new Date(),
        },
        penalty: null, // Make sure we haven't already penalized this order
      },
    });

    if (uncollectedOrders.length === 0) {
      this.logger.log('No uncollected COD orders found.');
      return;
    }

    // Process all orders in a single transaction for better performance
    const penaltyCreateOperations = uncollectedOrders.map((order) =>
      this.prisma.penalty.create({
        data: {
          amount: order.total,
          orderId: order.id,
          userId: order.userId,
        },
      }),
    );

    // Get unique user IDs to block
    const userIdsToBlock = [
      ...new Set(uncollectedOrders.map((order) => order.userId)),
    ];
    const userBlockOperations = userIdsToBlock.map((userId) =>
      this.prisma.user.update({
        where: { id: userId },
        data: { isBlocked: true },
      }),
    );

    await this.prisma.$transaction([
      ...penaltyCreateOperations,
      ...userBlockOperations,
    ]);

    this.logger.log(
      `Penalized ${uncollectedOrders.length} orders and blocked ${userIdsToBlock.length} users.`,
    );
  }
}
