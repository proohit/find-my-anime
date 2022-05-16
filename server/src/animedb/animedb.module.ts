import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { ApiClientsModule } from '../api-clients/api-clients.module';
import { AnimeEnricherModule } from '../enrichment/anime-enricher.module';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';

@Module({
  imports: [AnimeEnricherModule, ApiClientsModule, HttpModule],
  controllers: [],
  providers: [AnilistClient, AnimeDbService, AnimeDbDownloaderService],
  exports: [AnimeDbService, AnimeDbDownloaderService],
})
export class AnimeDbModule {}
