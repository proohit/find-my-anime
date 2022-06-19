import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as rxjs from 'rxjs';
import { MyAnimeListClient } from './myanimelist-client.service';
jest.mock('rxjs', () => ({
  lastValueFrom: jest.fn(),
}));
describe('MyAnimeListClient', () => {
  const givenDescription = 'test';
  let myanimelistClient: MyAnimeListClient;
  beforeEach(async () => {
    (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
      Promise.resolve({
        data: { synopsis: givenDescription },
      }),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyAnimeListClient,
        {
          provide: HttpService,
          useValue: {
            get: () => jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'test',
          },
        },
      ],
    }).compile();
    myanimelistClient = module.get<MyAnimeListClient>(MyAnimeListClient);
  });

  describe('getAnime', () => {
    it('should return anime', async () => {
      const results = await myanimelistClient.getAnime('1234');
      expect(results.description).toBeDefined();
      expect(results.description).toEqual(givenDescription);
    });

    it('should handle error if AniDB API returned an error', async () => {
      const givenError = {
        message: '',
        error: 'not_found',
      };
      (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
        Promise.resolve({
          data: givenError,
        }),
      );
      await expect(myanimelistClient.getAnime('1234')).rejects.toThrow(
        JSON.stringify(givenError),
      );
    });
  });
});
