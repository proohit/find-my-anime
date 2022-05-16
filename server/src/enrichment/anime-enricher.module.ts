import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { ApiClientsModule } from '../api-clients/api-clients.module';
import { AnimeEnricherService } from './anime-enricher.service';

@Module({
  imports: [HttpModule, ApiClientsModule],
  controllers: [],
  providers: [AnilistClient, AnimeEnricherService],
  exports: [AnimeEnricherService],
})
export class AnimeEnricherModule {}
