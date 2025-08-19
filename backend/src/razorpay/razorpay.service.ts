import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(private config: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.config.get('RAZORPAY_KEY_ID'),
      key_secret: this.config.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(amount: number, receiptId: string) {
    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: receiptId,
    };
    return this.razorpay.orders.create(options);
  }
}