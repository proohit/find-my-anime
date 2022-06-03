import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnilistClient } from './anilist-client.service';
import { MyAnimeListClient } from './myanimelist-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AnilistClient, MyAnimeListClient, ConfigService],
  exports: [AnilistClient, MyAnimeListClient],
})
export class ApiClientsModule {}
