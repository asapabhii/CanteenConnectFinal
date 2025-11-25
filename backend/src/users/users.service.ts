import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(searchQuery?: string) {
    return this.prisma.user.findMany({
      where: searchQuery
        ? {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              {
                profile: {
                  name: { contains: searchQuery, mode: 'insensitive' },
                },
              },
              {
                profile: {
                  rollNumber: { contains: searchQuery, mode: 'insensitive' },
                },
              },
              {
                profile: {
                  facultyId: { contains: searchQuery, mode: 'insensitive' },
                },
              },
            ],
          }
        : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        isBlocked: true,
        profile: true,
        outletId: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        orders: {
          orderBy: { createdAt: 'desc' },
        },
        penalties: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Exclude password from the returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  updateRole(id: string, role: Role) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async toggleBlock(id: string) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: !userToUpdate.isBlocked },
    });
  }

  assignOutlet(id: string, outletId: string | null) {
    return this.prisma.user.update({ where: { id }, data: { outletId } });
  }
}
