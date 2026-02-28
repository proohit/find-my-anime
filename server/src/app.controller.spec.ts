import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Test } from '@nestjs/testing';
import { mockAnimeDb } from '../test/mockData';
import { AnimeDbService } from './animedb/animedb.service';
import { AppController } from './app.controller';
import { RequestCollectorInterceptor } from './stats/collector.interceptor';

describe('AppController', () => {
  let controller: AppController;
  let animeDbService: AnimeDbService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AnimeDbService,
          useValue: {
            queryAnime: () => Promise.resolve(mockAnimeDb.data),
            getTags: () => Promise.resolve(['tag1']),
          },
        },
      ],
    })
      .overrideInterceptor(RequestCollectorInterceptor)
      .useValue({
        intercept: jest
          .fn()
          .mockImplementation(() => Promise.resolve(undefined)),
      })
      .compile();
    controller = module.get(AppController);
    animeDbService = module.get(AnimeDbService);
  });

  it('should call queryAnime', async () => {
    const spy = jest
      .spyOn(animeDbService, 'queryAnime')
      .mockResolvedValue(mockAnimeDb.data);
    const anime = await controller.queryAnime('1234', 'sao', Provider.AniDB, [
      'tag1',
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      '1234',
      'sao',
      Provider.AniDB,
      ['tag1'],
      undefined,
      undefined,
    );
    expect(anime).toEqual(mockAnimeDb.data);
  });

  it('should call getTags', async () => {
    const givenTags = ['tag1', 'tag2'];
    const spy = jest
      .spyOn(animeDbService, 'getTags')
      .mockResolvedValue(givenTags);
    const tags = await controller.getTags();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(tags).toEqual(givenTags);
  });
});
