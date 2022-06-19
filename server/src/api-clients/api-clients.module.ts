import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AniDbClient } from './anidb-client.service';
import { AnilistClient } from './anilist-client.service';
import { MyAnimeListClient } from './myanimelist-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AnilistClient, MyAnimeListClient, AniDbClient, ConfigService],
  exports: [AnilistClient, MyAnimeListClient, AniDbClient],
})
export class ApiClientsModule {}
