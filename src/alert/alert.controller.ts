import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertQueryDto } from './dto/alert.dto';

@Controller('alert')
export class AlertController {
  private readonly logger = new Logger(AlertController.name);

  constructor(private readonly alertService: AlertService) {}
  @Get()
  async getAlertData(@Query() query: AlertQueryDto) {
    const { startDate, endDate, imei } = query;
    try {
      const result = await this.alertService.getAlertData(
        startDate,
        endDate,
        imei,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error getting track data: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: error.message || 'An unexpected error occurred',
          error: error.name || 'InternalServerError',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
