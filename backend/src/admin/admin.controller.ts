import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AdminService } from './admin.service';
import { OnboardVendorDto } from './dto/onboard-vendor.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('onboard-vendor')
  onboardVendor(@Body() dto: OnboardVendorDto) {
    return this.adminService.onboardVendorAndOutlet(dto);
  }
}
