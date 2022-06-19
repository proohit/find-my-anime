import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Test } from '@nestjs/testing';
import { mockAnimeDb } from '../test/mockData';
import { AnimeDbService } from './animedb/animedb.service';
import { AppController } from './app.controller';
import { AppModule } from './app.module';

describe('AppController', () => {
  let controller: AppController;
  let animeDbService: AnimeDbService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: AnimeDbService,
          useValue: {
            queryAnime: () => Promise.resolve(mockAnimeDb.data),
            getTags: () => Promise.resolve(['tag1']),
          },
        },
      ],
    }).compile();
    controller = module.get<AppController>(AppController);
    animeDbService = module.get<AnimeDbService>(AnimeDbService);
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
