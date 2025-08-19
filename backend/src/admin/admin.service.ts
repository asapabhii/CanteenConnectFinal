import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnboardVendorDto } from './dto/onboard-vendor.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async onboardVendorAndOutlet(dto: OnboardVendorDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Hash the vendor's password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.vendorPassword, salt);

      // 2. Create the Outlet
      const outlet = await tx.outlet.create({
        data: {
          name: dto.outletName,
          description: dto.outletDescription,
        },
      });

      // 3. Create the Vendor User and their Profile
      const vendor = await tx.user.create({
        data: {
          email: dto.vendorEmail,
          password: hashedPassword,
          role: Role.VENDOR,
          outletId: outlet.id, // Assign to the new outlet immediately
          profile: {
            create: {
              name: dto.vendorName,
            },
          },
        },
      });

      return { vendor, outlet };
    });
  }
}