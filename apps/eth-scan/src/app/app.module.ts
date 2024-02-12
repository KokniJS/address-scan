import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../config/app';
import dbConfig from '../config/db';
import scanConfig from '../config/eth.scan';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from '../cron/cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [appConfig, dbConfig, scanConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options: DataSourceOptions = { ...configService.get('db') };
        return options;
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CronModule,
    TransactionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
