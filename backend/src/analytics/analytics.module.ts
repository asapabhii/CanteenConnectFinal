import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { VendorAnalyticsService } from './vendor-analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, VendorAnalyticsService],
})
export class AnalyticsModule {}