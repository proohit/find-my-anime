import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';
import { AppController } from './app.controller';
import { AnimeEnricherModule } from './enrichment/anime-enricher.module';

@Module({
  imports: [HttpModule, AnimeEnricherModule],
  controllers: [AppController],
  providers: [AnimeDbService, AnimeDbDownloaderService],
})
export class AppModule {}
