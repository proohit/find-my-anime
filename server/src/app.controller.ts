import { Controller, Get, Query } from '@nestjs/common';
import { AnimeDbService } from './animedb/animedb.service';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Provider } from '@find-my-anime/shared/constants/Provider';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  async queryAnime(
    @Query('id') id?: string,
    @Query('query') query?: string,
    @Query('provider') provider?: string,
    @Query('tags') tags?: string,
  ): Promise<Anime[]> {
    if (provider && !Object.values(Provider).includes(provider as Provider)) {
      throw new Error(
        `Invalid provider. Valid providers: ${Object.values(Provider).join(
          ', ',
        )}`,
      );
    }
    return this.animedbService.queryAnime(
      id,
      query && decodeURIComponent(query),
      provider as Provider,
      tags && decodeURIComponent(tags).split(','),
    );
  }

  @Get('/tags')
  async getTags(): Promise<string[]> {
    return this.animedbService.getTags();
  }
}
