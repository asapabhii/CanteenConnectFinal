import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { DeliveryService } from './delivery.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.VENDOR)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('active')
  getActiveOrders(@GetUser() vendor: User) {
    return this.deliveryService.getActiveOrders(vendor);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @GetUser() vendor: User,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.deliveryService.updateOrderStatus(vendor, id, dto.status);
  }

  // NEW ENDPOINT
  @Patch(':id/cancel')
  cancelOrder(@GetUser() vendor: User, @Param('id') id: string) {
    return this.deliveryService.cancelOrder(vendor, id);
  }
}