import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnimeDbModule } from '../animedb/animedb.module';
import { RequestCollectorInterceptor } from './collector.interceptor';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [AnimeDbModule],
  controllers: [StatsController],
  providers: [
    StatsService,
    RequestCollectorInterceptor,
    TelemetryService,
    ConfigService,
  ],
  exports: [StatsService, RequestCollectorInterceptor, TelemetryService],
})
export class StatsModule {}
