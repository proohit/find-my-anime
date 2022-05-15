import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnilistClient } from '../anilist-client.service';
import { AnimeEnricherService } from './anime-enricher.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AnilistClient, AnimeEnricherService],
  exports: [AnimeEnricherService],
})
export class AnimeEnricherModule {}
