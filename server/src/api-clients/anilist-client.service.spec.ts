import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import * as rxjs from 'rxjs';
import { AnilistClient } from './anilist-client.service';
jest.mock(
  'rxjs',
  () =>
    ({
      ...jest.requireActual('rxjs'),
      lastValueFrom: jest.fn(),
    }) as typeof import('rxjs'),
);
describe('AnilistClient', () => {
  const givenDescription = 'test';
  let anilistClient: AnilistClient;
  beforeEach(async () => {
    (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
      Promise.resolve({
        data: { data: { Media: { description: givenDescription } } },
      }),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnilistClient,
        {
          provide: HttpService,
          useValue: {
            post: () => jest.fn(),
          },
        },
      ],
    }).compile();
    anilistClient = module.get<AnilistClient>(AnilistClient);
  });

  describe('getAnime', () => {
    it('should return anime', async () => {
      const results = await anilistClient.getAnime('1234');
      expect(results.description).toBeDefined();
      expect(results.description).toEqual(givenDescription);
    });
  });
});
