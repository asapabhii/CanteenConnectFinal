import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(Role.ADMIN)
  @Get('admin-dashboard')
  getAdminDashboardStats() {
    return this.analyticsService.getAdminDashboardStats();
  }

  @Roles(Role.ADMIN)
  @Get('sales-chart')
  getSalesChartData() {
    return this.analyticsService.getSalesOverTime(7);
  }

  // NEW ENDPOINT
  @Roles(Role.ADMIN)
  @Get('top-items')
  getTopItems() {
    return this.analyticsService.getTopSellingItems();
  }
}