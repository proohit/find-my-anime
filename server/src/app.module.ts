import { Module } from '@nestjs/common';
import { AnimeDbModule } from './animedb/animedb.module';
import { AppController } from './app.controller';
import { AnimeEnricherModule } from './enrichment/anime-enricher.module';

@Module({
  imports: [AnimeEnricherModule, AnimeDbModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
