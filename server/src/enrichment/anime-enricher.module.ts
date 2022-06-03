import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { ApiClientsModule } from '../api-clients/api-clients.module';
import { MyAnimeListClient } from '../api-clients/myanimelist-client.service';
import { AnimeEnricherService } from './anime-enricher.service';

@Module({
  imports: [HttpModule, ApiClientsModule],
  controllers: [],
  providers: [
    AnilistClient,
    MyAnimeListClient,
    ConfigService,
    AnimeEnricherService,
  ],
  exports: [AnimeEnricherService],
})
export class AnimeEnricherModule {}
