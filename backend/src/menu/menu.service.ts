import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // For the "Inventory" page - gets ALL items
  async findAll(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    return this.prisma.menuItem.findMany({
      where: { outletId: vendor.outletId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // NEW METHOD: For the "My Menu" page - gets only AVAILABLE items
  async findLive(vendor: User) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    return this.prisma.menuItem.findMany({
      where: {
        outletId: vendor.outletId,
        isAvailable: true, // The only difference is this line
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(vendor: User, dto: CreateMenuItemDto) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    return this.prisma.menuItem.create({
      data: { ...dto, outletId: vendor.outletId },
    });
  }

  async update(vendor: User, itemId: string, dto: UpdateMenuItemDto) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.outletId !== vendor.outletId) {
      throw new NotFoundException('Menu item not found or access denied');
    }
    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: dto,
    });
  }

  async remove(vendor: User, itemId: string) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.outletId !== vendor.outletId) {
      throw new NotFoundException('Menu item not found or access denied');
    }
    return this.prisma.menuItem.delete({ where: { id: itemId } });
  }

  async toggleAvailability(vendor: User, itemId: string) {
    if (!vendor.outletId) {
      throw new ForbiddenException('User is not assigned to an outlet');
    }
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.outletId !== vendor.outletId) {
      throw new NotFoundException('Menu item not found or access denied');
    }
    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable },
    });
  }
}
