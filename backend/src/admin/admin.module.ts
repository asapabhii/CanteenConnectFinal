import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [OrdersModule]
})
export class AdminModule {}
