import { IsString } from 'class-validator';

export class AlertQueryDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  imei?: string;
}
