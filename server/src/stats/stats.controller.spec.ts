import { Test } from '@nestjs/testing';
import { emptyMockStats } from '../../test/mockData';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let statsService: StatsService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StatsController,
        {
          provide: StatsService,
          useValue: {
            getStats: jest.fn().mockResolvedValue(emptyMockStats),
          },
        },
      ],
    }).compile();
    controller = module.get(StatsController);
    statsService = module.get(StatsService);
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
