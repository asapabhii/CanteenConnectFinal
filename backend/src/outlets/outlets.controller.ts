import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, Query } from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ItemCategory, Role } from '@prisma/client';

class CreateOutletDto {
  name: string;
  description?: string;
  openingTime?: Date;
  closingTime?: Date;
}

class UpdateOutletDto {
  name?: string;
  description?: string;
  openingTime?: Date;
  closingTime?: Date;
  maxOrdersPerSlot?: number;
}

@UseGuards(AuthGuard('jwt'))
@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createOutletDto: CreateOutletDto) {
    return this.outletsService.create(createOutletDto);
  }

  @Get()
  findAll() {
    return this.outletsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('category') category?: ItemCategory,
  ) {
    return this.outletsService.findOne(id, category);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletsService.update(id, updateOutletDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletsService.remove(id);
  }
}