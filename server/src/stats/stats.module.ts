import { Module } from '@nestjs/common';
import { AnimeDbModule } from '../animedb/animedb.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [AnimeDbModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
