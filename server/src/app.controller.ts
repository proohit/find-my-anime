import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnimeDbService } from './animedb/animedb.service';
import { arrayQueryTransformer } from './validators/Array';
import { validateEnumQueryTransformer as enumQueryTransformer } from './validators/Enum';
import { stringQueryTransformer } from './validators/String';

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
    @Query('query', stringQueryTransformer())
    query?: string,
    @Query('provider', enumQueryTransformer({ enumType: Provider }))
    provider?: Provider,
    @Query('tags', arrayQueryTransformer({ separator: ',', trim: true }))
    tags?: string[],
  ): Promise<Anime[]> {
    return this.animedbService.queryAnime(id, query, provider, tags);
  }
  @ApiOperation({
    description: 'Get all available tags',
  })
  @Get('/tags')
  async getTags(): Promise<string[]> {
    return this.animedbService.getTags();
  }
}
