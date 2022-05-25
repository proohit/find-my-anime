import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAnimeDb } from '../../test/mockData';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import * as rxjs from 'rxjs';
jest.mock('fs');
jest.mock('fs/promises');
jest.mock('rxjs', () => ({
  lastValueFrom: jest.fn(),
}));

describe('AnimeDbDownloaderService', () => {
  let animeDbDownloaderService: AnimeDbDownloaderService;
  let httpService: HttpService;
  beforeEach(async () => {
    (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
      Promise.resolve({ data: mockAnimeDb }),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeDbDownloaderService,
        {
          provide: HttpService,
          useValue: {
            get: () => Promise.resolve(mockAnimeDb),
          },
        },
      ],
    }).compile();
    animeDbDownloaderService = module.get<AnimeDbDownloaderService>(
      AnimeDbDownloaderService,
    );
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getAnimeDb', () => {
    it('should return animedb', async () => {
      const results = await animeDbDownloaderService.getAnimeDb();
      expect(results).toEqual(mockAnimeDb);
    });

    it('should return cached animedb', async () => {
      const mockGet = jest.spyOn(httpService, 'get');
      await animeDbDownloaderService.getAnimeDb();
      await animeDbDownloaderService.getAnimeDb();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should check for last download time', async () => {
      const mockGet = jest.spyOn(httpService, 'get');
      await animeDbDownloaderService.getAnimeDb();
      Object.defineProperty(animeDbDownloaderService, 'animeDbCache', {
        get: jest.fn(() => ({
          ...mockAnimeDb,
          lastDownloadTime: new Date(
            new Date().getTime() - 1000 * 60 * 60 * 24 * 7,
          ).toISOString(),
        })),
        set: jest.fn(),
      });
      await animeDbDownloaderService.getAnimeDb();
      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });
});
