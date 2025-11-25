import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ReviewsService } from './reviews.service';

class CreateReviewDto {
  orderId: string;
  rating: number;
  comment?: string;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.STUDENT, Role.FACULTY)
  @Post()
  create(@GetUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user, dto);
  }

  @Roles(Role.VENDOR)
  @Get('my-outlet')
  findForVendor(@GetUser() vendor: User) {
    return this.reviewsService.findForVendor(vendor);
  }
}
