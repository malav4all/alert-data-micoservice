import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ALERT_DATA' })
export class Alert extends Document {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  altitude: number;

  @Prop()
  imei: string;

  @Prop()
  bearing: number;

  @Prop()
  deviceType: string;

  @Prop()
  dateTime: string;

  @Prop()
  alertMessage: string;

  @Prop()
  source: string;

  @Prop()
  value: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
