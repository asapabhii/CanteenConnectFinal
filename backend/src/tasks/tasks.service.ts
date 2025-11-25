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

    for (const order of uncollectedOrders) {
      this.logger.log(`Penalizing order ${order.id} for user ${order.userId}`);

      // Use a transaction to ensure both actions succeed or fail together
      await this.prisma.$transaction([
        // 1. Create the penalty record
        this.prisma.penalty.create({
          data: {
            amount: order.total,
            orderId: order.id,
            userId: order.userId,
          },
        }),
        // 2. Block the user
        this.prisma.user.update({
          where: { id: order.userId },
          data: { isBlocked: true },
        }),
      ]);
    }
  }
}
