import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnimeDbService } from './animedb/animedb.service';
import { RequestCollectorInterceptor } from './stats/collector.interceptor';
import { arrayQueryTransformer } from './validators/Array';
import { booleanQueryTransformer } from './validators/Boolean';
import { validateEnumQueryTransformer as enumQueryTransformer } from './validators/Enum';
import { stringQueryTransformer } from './validators/String';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  @UseInterceptors(RequestCollectorInterceptor)
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
  })
  @ApiQuery({
    name: 'excludedTags',
    type: String,
    description: 'Comma separated list of tags to be excluded from search',
    required: false,
    example: 'fantasy',
  })
  @ApiQuery({
    name: 'includeAdult',
    type: Boolean,
    description: 'Include adult anime. Default is false',
    required: false,
    example: 'true',
  })
  @ApiQuery({
    name: 'collectionConsent',
    type: Boolean,
    description: 'Permit collection of (anonymous) data. Default is true',
    required: false,
    example: 'true',
  })
  async queryAnime(
    @Query('id') id?: string,
    @Query('query', stringQueryTransformer())
    query?: string,
    @Query('provider', enumQueryTransformer({ enumType: Provider }))
    provider?: Provider,
    @Query('tags', arrayQueryTransformer({ separator: ',', trim: true }))
    tags?: string[],
    @Query(
      'excludedTags',
      arrayQueryTransformer({ separator: ',', trim: true }),
    )
    excludedTags?: string[],
    @Query('includeAdult', booleanQueryTransformer())
    includeAdult?: boolean,
  ): Promise<Anime[]> {
    return this.animedbService.queryAnime(
      id,
      query,
      provider,
      tags,
      excludedTags,
      includeAdult,
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
