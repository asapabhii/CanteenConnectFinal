import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus, Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

class UpdateStatusDto {
    status: OrderStatus;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- ADMIN ROUTES ---
  @Roles(Role.ADMIN)
  @Get('admin/all')
  findAllForAdmin(@Query('search') search?: string) {
    const where = search ? { id: { contains: search, mode: 'insensitive' as const } } : undefined;
    return this.ordersService.findAllForAdmin({ where });
  }

  @Roles(Role.ADMIN)
  @Get('admin/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.ordersService.findOneForAdmin(id);
  }

  @Roles(Role.ADMIN)
  @Patch('admin/:id/status')
  updateStatusForAdmin(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.ordersService.updateStatusForAdmin(id, dto.status);
  }

  // --- CUSTOMER ROUTES ---
  @Roles(Role.STUDENT, Role.FACULTY)
  @Post()
  placeOrder(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.placeOrder(user, createOrderDto);
  }

  @Roles(Role.STUDENT, Role.FACULTY)
  @Get('my-history')
  findMyHistory(@GetUser() user: User) {
    return this.ordersService.findForUser(user.id);
  }
}