import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AlertModule } from './alert/alert.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.DB_URL,
      }),
    }),
    AlertModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
