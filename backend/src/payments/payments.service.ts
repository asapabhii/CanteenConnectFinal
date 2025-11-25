import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { EventsGateway } from 'src/events/events.gateway';
import { User } from '@prisma/client';
import { RazorpayService } from 'src/razorpay/razorpay.service';

interface WebhookBody {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        order_id?: string;
      };
    };
  };
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private eventsGateway: EventsGateway,
    private razorpay: RazorpayService,
  ) {}

  async handleWebhook(signature: string, body: WebhookBody) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      throw new BadRequestException('Razorpay secret not configured');
    }
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (body.event === 'payment.captured') {
      const razorpayOrderId = body.payload?.payment?.entity?.order_id;
      if (!razorpayOrderId) {
        throw new BadRequestException('Missing order ID in webhook payload');
      }
      const order = await this.prisma.order.update({
        where: { razorpayOrderId: razorpayOrderId },
        data: { status: 'CONFIRMED' },
      });

      this.eventsGateway.server.to(order.outletId).emit('newOrder', order);
      console.log(`Order ${razorpayOrderId} confirmed via webhook.`);
    }

    return { status: 'ok' };
  }

  async verifyPayment(dto: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      throw new BadRequestException('Razorpay secret not configured');
    }
    const body = dto.razorpay_order_id + '|' + dto.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === dto.razorpay_signature) {
      const order = await this.prisma.order.update({
        where: { razorpayOrderId: dto.razorpay_order_id },
        data: { status: 'CONFIRMED' },
      });

      this.eventsGateway.server.to(order.outletId).emit('newOrder', order);

      return { status: 'success', orderId: order.id };
    } else {
      throw new BadRequestException('Invalid payment signature');
    }
  }

  async findMyUnpaidPenalties(user: User) {
    return this.prisma.penalty.findMany({
      where: { userId: user.id, status: 'UNPAID' },
      include: { order: true },
    });
  }

  async createPenaltyPaymentOrder(user: User, penaltyId: string) {
    const penalty = await this.prisma.penalty.findUnique({
      where: { id: penaltyId },
    });

    if (!penalty || penalty.userId !== user.id) {
      throw new NotFoundException('Penalty not found or access denied.');
    }
    if (penalty.status === 'PAID') {
      throw new ForbiddenException('This penalty has already been paid.');
    }

    const razorpayOrder = await this.razorpay.createOrder(
      penalty.amount,
      `penalty_${penalty.id}`,
    );

    await this.prisma.penalty.update({
      where: { id: penaltyId },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return razorpayOrder;
  }

  async verifyPenaltyPayment(dto: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      throw new BadRequestException('Razorpay secret not configured');
    }
    const body = dto.razorpay_order_id + '|' + dto.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === dto.razorpay_signature) {
      const penalty = await this.prisma.penalty.findUnique({
        where: { razorpayOrderId: dto.razorpay_order_id },
      });
      if (!penalty) throw new NotFoundException('Penalty record not found.');

      const [, updatedUser] = await this.prisma.$transaction([
        this.prisma.penalty.update({
          where: { id: penalty.id },
          data: { status: 'PAID' },
        }),
        this.prisma.user.update({
          where: { id: penalty.userId },
          data: { isBlocked: false },
        }),
      ]);

      return { status: 'success', userId: updatedUser.id };
    } else {
      throw new BadRequestException('Invalid payment signature');
    }
  }
}
