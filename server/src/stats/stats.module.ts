import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TelemetryDataModel,
  TelemetryDataSchema,
} from 'src/animedb/schemas/telemetry-data.schema';
import { AnimeDbModule } from '../animedb/animedb.module';
import { RequestCollectorInterceptor } from './collector.interceptor';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TelemetryDataService } from './telemetry-data.service';

@Module({
  imports: [
    AnimeDbModule,
    MongooseModule.forFeature([
      { name: TelemetryDataModel.name, schema: TelemetryDataSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [
    StatsService,
    RequestCollectorInterceptor,
    TelemetryDataService,
    ConfigService,
  ],
  exports: [StatsService, RequestCollectorInterceptor, TelemetryDataService],
})
export class StatsModule {}
