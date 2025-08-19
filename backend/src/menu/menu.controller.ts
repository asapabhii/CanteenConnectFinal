import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role, User } from '@prisma/client';
import { MenuService } from './menu.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.VENDOR)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // This now serves the "Inventory" page
  @Get()
  findAll(@GetUser() vendor: User) {
    return this.menuService.findAll(vendor);
  }

  // NEW ENDPOINT: Serves the "My Menu" page
  @Get('live')
  findLive(@GetUser() vendor: User) {
    return this.menuService.findLive(vendor);
  }

  @Post()
  create(@GetUser() vendor: User, @Body() dto: CreateMenuItemDto) {
    return this.menuService.create(vendor, dto);
  }
  
  @Patch(':id')
  update(@GetUser() vendor: User, @Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(vendor, id, dto);
  }

  @Delete(':id')
  remove(@GetUser() vendor: User, @Param('id') id: string) {
    return this.menuService.remove(vendor, id);
  }

  @Patch(':id/availability')
  toggleAvailability(@GetUser() vendor: User, @Param('id') id: string) {
    return this.menuService.toggleAvailability(vendor, id);
  }
}