import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnimeDbService } from './animedb/animedb.service';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  @ApiOperation({
    description:
      'Search anime by filter parameters. Default limits result to 20',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Id of an anime, as provided by a provider',
    required: false,
  })
  @ApiQuery({
    name: 'provider',
    type: String,
    description: 'Anime Provider',
    enum: Provider,
    required: false,
    example: 'Anilist',
  })
  @ApiQuery({
    name: 'query',
    type: String,
    description: 'Search query. Searches by title',
    required: false,
    example: 'sword art online',
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    description: 'Comma separated list of tags to search for',
    required: false,
    example: 'fantasy',
  })
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
  @ApiOperation({
    description: 'Get all available tags',
  })
  @Get('/tags')
  async getTags(): Promise<string[]> {
    return this.animedbService.getTags();
  }
}
