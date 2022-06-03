import { Test } from '@nestjs/testing';
import { emptyMockStats } from '../../test/mockData';
import { AnimeDbService } from '../animedb/animedb.service';
import { StatsController } from './stats.controller';
import { StatsModule } from './stats.module';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let statsService: StatsService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [StatsModule],
      providers: [
        {
          provide: StatsService,
          useValue: {
            getStats: () => Promise.resolve(emptyMockStats),
          },
        },
        {
          provide: AnimeDbService,
          useValue: {
            getLastDownloaded: () => Promise.resolve(new Date()),
            getAllAnimes: () => Promise.resolve([]),
            getTags: () => Promise.resolve([]),
          },
        },
      ],
    }).compile();
    controller = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
  });
  it('should call getStats', async () => {
    const spy = jest
      .spyOn(statsService, 'getStats')
      .mockResolvedValue(emptyMockStats);
    const stats = await controller.getStatus();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(stats).toEqual(emptyMockStats);
  });
});
