import { Body, Controller, Headers, Post, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

class VerifyPaymentDto {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any,
  ) {
    return this.paymentsService.handleWebhook(signature, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-penalties')
  findMyUnpaidPenalties(@GetUser() user: User) {
    return this.paymentsService.findMyUnpaidPenalties(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('penalties/:id/pay')
  createPenaltyPaymentOrder(@GetUser() user: User, @Param('id') id: string) {
    return this.paymentsService.createPenaltyPaymentOrder(user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('penalties/verify')
  verifyPenaltyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPenaltyPayment(dto);
  }
}