import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOutletDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}