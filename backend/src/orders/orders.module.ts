import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RazorpayModule } from 'src/razorpay/razorpay.module'; // <-- IMPORT HERE

@Module({
  imports: [RazorpayModule], // <-- ADD THIS LINE
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}