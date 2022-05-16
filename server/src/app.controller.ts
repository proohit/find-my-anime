import { Controller, Get, Query } from '@nestjs/common';
import { Provider } from '@shared/constants/Provider';
import { Anime } from '@shared/interfaces/AnimeDb';
import { AnimeDbService } from './animedb/animedb.service';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  async queryAnime(
    @Query('query') query: string,
    @Query('provider') provider?: string,
  ): Promise<Anime[]> {
    if (provider && !Object.values(Provider).includes(provider as Provider)) {
      throw new Error(
        `Invalid provider. Valid providers: ${Object.values(Provider).join(
          ', ',
        )}`,
      );
    }
    return this.animedbService.queryAnime(
      decodeURIComponent(query),
      provider as Provider,
    );
  }
}
