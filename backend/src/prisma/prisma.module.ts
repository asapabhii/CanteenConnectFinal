import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Global } from '@nestjs/common'; // <-- Add Global

@Global() // <-- ADD THIS DECORATOR
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
