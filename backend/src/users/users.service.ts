import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { LogsService } from 'src/logs/logs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  findAll(searchQuery?: string) {
    return this.prisma.user.findMany({
      where: searchQuery
        ? {
            OR: [
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { profile: { name: { contains: searchQuery, mode: 'insensitive' } } },
              { profile: { rollNumber: { contains: searchQuery, mode: 'insensitive' } } },
              { profile: { facultyId: { contains: searchQuery, mode: 'insensitive' } } },
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
    delete (user as any).password;
    return user;
  }

  async updateRole(id: string, role: Role, adminUser: User) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) throw new NotFoundException('User not found');

    await this.logsService.logActivity({
      actorId: adminUser.id,
      actorName: adminUser.email,
      action: 'USER_ROLE_CHANGED',
      targetId: id,
      details: { from: userToUpdate.role, to: role },
    });
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async toggleBlock(id: string, adminUser: User) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) throw new NotFoundException('User not found');

    await this.logsService.logActivity({
      actorId: adminUser.id,
      actorName: adminUser.email,
      action: 'USER_BLOCK_TOGGLED',
      targetId: id,
      details: { isBlocked: !userToUpdate.isBlocked },
    });
    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: !userToUpdate.isBlocked },
    });
  }

  async assignOutlet(id: string, outletId: string | null, adminUser: User) {
    await this.logsService.logActivity({
      actorId: adminUser.id,
      actorName: adminUser.email,
      action: 'VENDOR_OUTLET_ASSIGNED',
      targetId: id,
      details: { outletId },
    });
    return this.prisma.user.update({ where: { id }, data: { outletId } });
  }
}