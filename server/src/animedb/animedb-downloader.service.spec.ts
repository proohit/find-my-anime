import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAnimeDb } from '../../test/mockData';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import * as rxjs from 'rxjs';
jest.mock('fs');
jest.mock('rxjs', () => ({
  lastValueFrom: jest.fn(),
}));

describe('AnimeDbDownloaderService', () => {
  let animeDbDownloaderService: AnimeDbDownloaderService;
  const mockHttpService = {
    provide: HttpService,
    useValue: {
      get: () => Promise.resolve(mockAnimeDb),
    },
  };
  beforeEach(async () => {
    (rxjs.lastValueFrom as jest.Mock).mockReturnValue(
      Promise.resolve({ data: mockAnimeDb }),
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimeDbDownloaderService, mockHttpService],
    }).compile();

    animeDbDownloaderService = module.get<AnimeDbDownloaderService>(
      AnimeDbDownloaderService,
    );
  });

  describe('getAnimeDb', () => {
    it('should return animedb', async () => {
      const results = await animeDbDownloaderService.getAnimeDb();
      expect(results).toEqual(mockAnimeDb);
    });

    it('should return cached animedb', async () => {
      const mockGet = jest.spyOn(mockHttpService.useValue, 'get');
      await animeDbDownloaderService.getAnimeDb();
      await animeDbDownloaderService.getAnimeDb();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});
