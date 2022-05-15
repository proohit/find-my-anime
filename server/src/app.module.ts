import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnilistClient } from './anilist-client.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    AnimeDbService,
    AnimeDbDownloaderService,
    AnilistClient,
  ],
})
export class AppModule {}
