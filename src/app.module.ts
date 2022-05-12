import { Module } from '@nestjs/common';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AnimeDbService, AnimeDbDownloaderService],
})
export class AppModule {}
