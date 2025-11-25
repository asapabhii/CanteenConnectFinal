import { IsEnum } from 'class-validator';
import { MenuStatus } from '@prisma/client';

export class UpdateMenuStatusDto {
  @IsEnum(MenuStatus)
  status: MenuStatus;
}
