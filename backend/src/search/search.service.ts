import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    if (!query) {
      return { outlets: [], menuItems: [] };
    }

    const outlets = await this.prisma.outlet.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
    });

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        name: { contains: query, mode: 'insensitive' },
      },
      include: { outlet: { select: { name: true } } },
    });

    return { outlets, menuItems };
  }
}
