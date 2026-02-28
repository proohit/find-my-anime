import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { ApiClientsModule } from '../api-clients/api-clients.module';
import { AnimeEnricherModule } from '../enrichment/anime-enricher.module';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';
import {
  AnimeDbMetadataModel,
  AnimeDbMetadataSchema,
} from './schemas/anime-metadata.schema';
import { AnimeModel, AnimeSchema } from './schemas/anime.schema';
import {
  TelemetryDataModel,
  TelemetryDataSchema,
} from './schemas/telemetry-data.schema';
import { TelemetryDataService } from './telemetry-data.service';
import { MetadataService } from './metadata.service';
import { AnimeSearchService } from './anime-search.service';

@Module({
  imports: [
    AnimeEnricherModule,
    ApiClientsModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: AnimeModel.name, schema: AnimeSchema },
      { name: AnimeDbMetadataModel.name, schema: AnimeDbMetadataSchema },
      { name: TelemetryDataModel.name, schema: TelemetryDataSchema },
    ]),
  ],
  controllers: [],
  providers: [
    AnilistClient,
    AnimeDbService,
    AnimeDbDownloaderService,
    TelemetryDataService,
    MetadataService,
    AnimeSearchService,
  ],
  exports: [
    AnimeDbService,
    AnimeDbDownloaderService,
    TelemetryDataService,
    MetadataService,
    AnimeSearchService,
  ],
})
export class AnimeDbModule {}
