import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertSchema } from './schemas/alert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ALERT_DATA', schema: AlertSchema }]),
  ],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
