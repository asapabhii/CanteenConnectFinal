import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { OutletsModule } from './outlets/outlets.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DeliveryModule } from './delivery/delivery.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CouponsModule } from './coupons/coupons.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EventsModule } from './events/events.module';
import { SearchModule } from './search/search.module';
import { LogsModule } from './logs/logs.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    // CORRECTED CONFIGURATION
    ThrottlerModule.forRoot([{ 
      ttl: 60000, // 60 seconds in milliseconds
      limit: 20,  // 20 requests per IP per minute
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    OutletsModule,
    MenuModule,
    OrdersModule,
    PaymentsModule,
    RazorpayModule,
    KitchenModule,
    DeliveryModule,
    AnalyticsModule,
    ChatbotModule,
    CouponsModule,
    AdminModule,
    UploadsModule,
    ReviewsModule,
    EventsModule,
    SearchModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}