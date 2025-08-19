import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { KitchenService } from './kitchen.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.VENDOR)
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('prepare')
  getOrdersToPrepare(@GetUser() vendor: User) {
    return this.kitchenService.getOrdersToPrepare(vendor);
  }
}