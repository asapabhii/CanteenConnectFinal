import { Injectable } from '@nestjs/common';
import { ItemCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateOutletDto {
  name: string;
  description?: string;
  openingTime?: Date;
  closingTime?: Date;
}

interface UpdateOutletDto {
  name?: string;
  description?: string;
  openingTime?: Date;
  closingTime?: Date;
  maxOrdersPerSlot?: number;
}

@Injectable()
export class OutletsService {
  constructor(private prisma: PrismaService) {}

  create(createOutletDto: CreateOutletDto) {
    return this.prisma.outlet.create({ data: createOutletDto });
  }

  findAll() {
    return this.prisma.outlet.findMany({
      include: {
        vendors: {
          select: { email: true, profile: { select: { name: true } } },
        },
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  findOne(id: string, category?: ItemCategory) {
    return this.prisma.outlet.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: {
            isAvailable: true,
            category: category,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateOutletDto) {
    return this.prisma.outlet.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.outlet.delete({ where: { id } });
  }
}