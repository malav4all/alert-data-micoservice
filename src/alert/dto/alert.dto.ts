import { IsNumber, IsString } from 'class-validator';

export class AlertQueryDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  imei?: string;

  @IsNumber()
  page?: number;

  @IsNumber()
  limit?: number;
}
