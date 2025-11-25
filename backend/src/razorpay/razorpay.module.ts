import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Module({
  providers: [RazorpayService],
  exports: [RazorpayService], // Export the service so other modules can use it
})
export class RazorpayModule {}
