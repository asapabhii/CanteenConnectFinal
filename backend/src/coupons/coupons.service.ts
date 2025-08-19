import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        code: createCouponDto.code.toUpperCase(), // Store codes in uppercase
        discountPercentage: createCouponDto.discountPercentage,
      },
    });
  }
}