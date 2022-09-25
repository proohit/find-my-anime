import {
  TelemetryEntry,
  TelemetrySource,
} from '@find-my-anime/shared/interfaces/AnimeDb';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAnimeDb } from '../../test/mockData';
import { AnimeDbDownloaderService } from '../animedb/animedb-downloader.service';
import { TelemetryService } from './telemetry.service';

describe('TelemetryService', () => {
  let telemetryService: TelemetryService;
  let animeDbDownloaderService: AnimeDbDownloaderService;
  let saveSpy: jest.SpyInstance;
  let getAnimeDbSpy: jest.SpyInstance;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryService,
        {
          provide: AnimeDbDownloaderService,
          useValue: {
            getAnimeDb: () =>
              Promise.resolve({ ...mockAnimeDb, telemetry: [] }),
            saveAnimeDb: () => Promise.resolve(),
          },
        },
      ],
    }).compile();
    telemetryService = module.get<TelemetryService>(TelemetryService);
    animeDbDownloaderService = module.get<AnimeDbDownloaderService>(
      AnimeDbDownloaderService,
    );
    saveSpy = jest.spyOn(animeDbDownloaderService, 'saveAnimeDb');
    getAnimeDbSpy = jest.spyOn(animeDbDownloaderService, 'getAnimeDb');
  });

  afterEach(() => {
    saveSpy.mockClear();
    getAnimeDbSpy.mockClear();
  });

  describe('saveTelemetryEntry', () => {
    const testEntry: TelemetryEntry = { data: 'test' };
    it('should save telemetry entry correctly', async () => {
      await telemetryService.saveTelemetryEntry(testEntry);
      expect(saveSpy).toHaveBeenLastCalledWith({
        ...mockAnimeDb,
        telemetry: [{ ...testEntry, count: 1 }],
      });
    });

    it('should increase count on existing entry', async () => {
      await telemetryService.saveTelemetryEntry(testEntry);
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          telemetry: [{ ...testEntry, count: 1 }],
        }),
      );
      await telemetryService.saveTelemetryEntry(testEntry);
      expect(saveSpy).toHaveBeenLastCalledWith({
        ...mockAnimeDb,
        telemetry: [{ ...testEntry, count: 2 }],
      });
    });

    it('should create separate entries with differing sources', async () => {
      const givenAnonymousEntry: TelemetryEntry = {
        data: testEntry.data,
        source: TelemetrySource.Anonymous,
      };
      const givenAppEntry: TelemetryEntry = {
        data: testEntry.data,
        source: TelemetrySource.App,
      };
      await telemetryService.saveTelemetryEntry(givenAnonymousEntry);
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          telemetry: [{ ...givenAnonymousEntry, count: 1 }],
        }),
      );
      await telemetryService.saveTelemetryEntry(givenAppEntry);
      expect(saveSpy).toHaveBeenLastCalledWith({
        ...mockAnimeDb,
        telemetry: [
          { ...givenAnonymousEntry, count: 1 },
          { ...givenAppEntry, count: 1 },
        ],
      });
    });
  });

  describe('getAnimeDbWithTelemetry', () => {
    it('should return telemetry', async () => {
      const givenTelemetry = [{ data: 'test', count: 1 }];
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          telemetry: givenTelemetry,
        }),
      );
      const animeDb = await telemetryService.getAnimeDbWithTelemetry();
      expect(animeDb).toEqual({
        ...mockAnimeDb,
        telemetry: givenTelemetry,
      });
    });
    it('should create telemetry array if not exists', async () => {
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          telemetry: undefined,
        }),
      );
      const animeDb = await telemetryService.getAnimeDbWithTelemetry();
      expect(animeDb).toEqual({
        ...mockAnimeDb,
        telemetry: [],
      });
    });
  });
});
