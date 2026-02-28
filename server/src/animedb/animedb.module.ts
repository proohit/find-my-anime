import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { ApiClientsModule } from '../api-clients/api-clients.module';
import { AnimeEnricherModule } from '../enrichment/anime-enricher.module';
import { AnimeSearchService } from './anime-search.service';
import { AnimeDbService } from './animedb.service';
import { MetadataService } from './metadata.service';
import {
  AnimeDbMetadataModel,
  AnimeDbMetadataSchema,
} from './schemas/anime-metadata.schema';
import { AnimeModel, AnimeSchema } from './schemas/anime.schema';

@Module({
  imports: [
    AnimeEnricherModule,
    ApiClientsModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: AnimeModel.name, schema: AnimeSchema },
      { name: AnimeDbMetadataModel.name, schema: AnimeDbMetadataSchema },
    ]),
  ],
  controllers: [],
  providers: [
    AnilistClient,
    AnimeDbService,
    MetadataService,
    AnimeSearchService,
  ],
  exports: [AnimeDbService, MetadataService, AnimeSearchService],
})
export class AnimeDbModule {}
