import * as moment from 'moment-timezone';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(@InjectModel('ALERT_DATA') private alertModel: Model<any>) {}

  async getAlertData(
    startDate: string,
    endDate: string,
    imei: any,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      if (!startDate || !endDate || !imei) {
        throw new BadRequestException(
          'Start date and end date and imei are required ',
        );
      }

      // Validate and set pagination parameters
      page = page && page > 0 ? Math.floor(page) : 1;
      limit = limit && limit > 0 ? Math.floor(limit) : 10;
      const skip = (page - 1) * limit;

      const startDateUTC = this.convertISTtoUTC(startDate);
      const endDateUTC = this.convertISTtoUTC(endDate);

      this.logger.log(
        `Fetching track data from ${startDateUTC} to ${endDateUTC}${imei ? ` for IMEI: ${imei}` : ''}, page: ${page}, limit: ${limit}`,
      );

      // First pipeline to get the total count
      const countPipeline: any = [];
      const matchStage: any = {
        $match: {
          dateTime: {
            $gte: startDateUTC,
            $lte: endDateUTC,
          },
        },
      };

      if (imei) {
        matchStage.$match.imei = imei;
      }

      countPipeline.push(matchStage);
      countPipeline.push({
        $count: 'totalCount',
      });

      // Data pipeline with pagination
      const dataPipeline: any = [];
      dataPipeline.push(matchStage);
      dataPipeline.push({
        $sort: { dateTime: 1 },
      });
      dataPipeline.push({
        $skip: skip,
      });
      dataPipeline.push({
        $limit: limit,
      });
      dataPipeline.push({
        $project: {
          _id: 1,
          latitude: 1,
          longitude: 1,
          altitude: 1,
          imei: 1,
          deviceTypeAlert: 1,
          bearing: 1,
          dateTime: 1,
          alertMessage: 1,
          source: 1,
          value: 1,
          alertType: 1,
        },
      });

      // Execute both pipelines in parallel
      const [countResult, dataResult] = await Promise.all([
        this.alertModel.aggregate(countPipeline).exec(),
        this.alertModel.aggregate(dataPipeline).exec(),
      ]);

      const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

      if (totalCount === 0 || dataResult.length === 0) {
        throw new NotFoundException(
          'No track data found for the given criteria',
        );
      }

      this.logger.log(
        `Successfully retrieved ${dataResult.length} track records out of ${totalCount}`,
      );
      return {
        success: true,
        count: totalCount,
        data: dataResult,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private convertISTtoUTC(istDateStr: string): string {
    try {
      if (moment) {
        return moment.tz(istDateStr, 'Asia/Kolkata').utc().toISOString();
      }
      const istDate = new Date(istDateStr);
      if (isNaN(istDate.getTime())) {
        throw new BadRequestException(`Invalid date format: ${istDateStr}`);
      }
      const utcDate = new Date(istDate.getTime() - (5 * 60 + 30) * 60 * 1000);
      return utcDate.toISOString();
    } catch (error) {
      throw new BadRequestException(`Error converting date: ${error.message}`);
    }
  }

  private handleError(error: any) {
    this.logger.error(
      `Error in TrackDataService: ${error.message}`,
      error.stack,
    );

    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (error.name === 'MongoServerError') {
      throw new InternalServerErrorException('Database error occurred');
    }

    throw new InternalServerErrorException(
      'An unexpected error occurred while processing your request',
    );
  }
}
