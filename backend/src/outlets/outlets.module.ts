import { Module } from '@nestjs/common';
import { OutletsController } from './outlets.controller';
import { OutletsService } from './outlets.service';

@Module({
  controllers: [OutletsController],
  providers: [OutletsService]
})
export class OutletsModule {}
