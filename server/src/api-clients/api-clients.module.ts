import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnilistClient } from './anilist-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AnilistClient],
  exports: [AnilistClient],
})
export class ApiClientsModule {}
