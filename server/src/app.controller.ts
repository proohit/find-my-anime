import { Controller, Get, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Provider } from '@shared/constants/Provider';
import { AnimeDbService } from './animedb.service';
import { Anime } from './interfaces/AnimeDb';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiParam({ name: 'provider', required: false, enum: Provider })
  async getAnimeById(
    @Query('id') id: string,
    @Query('provider') provider?: string,
  ): Promise<Anime> {
    if (provider && !Object.values(Provider).includes(provider as Provider)) {
      throw new Error(
        `Invalid provider. Valid providers: ${Object.values(Provider).join(
          ', ',
        )}`,
      );
    }
    return this.animedbService.getAnimeById(id, provider as Provider);
  }
}
