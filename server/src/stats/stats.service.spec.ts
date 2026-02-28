import { Season } from '@find-my-anime/shared/constants/Season';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Test, TestingModule } from '@nestjs/testing';
import { emptyAnime, mockTelemetry } from '../../test/mockData';
import { AnimeDbService } from '../animedb/animedb.service';
import { StatsService } from './stats.service';
import { TelemetryDataService } from './telemetry-data.service';

describe('StatsService', () => {
  let statsService: StatsService;
  const givenData: Anime[] = [
    {
      ...emptyAnime,
      animeSeason: { season: Season.Fall, year: 2020 },
      tags: ['tag2'],
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Spring, year: 2021 },
      tags: ['tag1'],
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Summer, year: 2021 },
      tags: ['tag2'],
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Winter, year: 2021 },
      tags: ['tag2'],
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Summer, year: 2021 },
      tags: ['tag2'],
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Undefined, year: 2021 },
    },
    {
      ...emptyAnime,
      animeSeason: { season: Season.Fall, year: NaN },
    },
  ];
  const givenTags: string[] = ['tag1', 'tag2', 'tag1'];
  const givenLastDownloadedTime = '2020-01-01T00:00:00.000Z';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: AnimeDbService,
          useValue: {
            getAllAnime: jest.fn().mockResolvedValue(givenData),
            getTags: jest.fn().mockResolvedValue(givenTags),
            getLastDownloaded: jest
              .fn()
              .mockResolvedValue(givenLastDownloadedTime),
          },
        },
        {
          provide: TelemetryDataService,
          useValue: {
            getTelemetryData: jest.fn().mockResolvedValue(mockTelemetry),
          },
        },
      ],
    }).compile();
    statsService = module.get(StatsService);
  });

  describe('animeSeasons', () => {
    it('should return animeSeason correctly', async () => {
      const stats = await statsService.getStats();
      expect(Object.keys(stats.anime.seasons).length).toEqual(4);
      expect(stats.anime.seasons).toStrictEqual({
        [`${Season.Spring}-2021`]: 1,
        [`${Season.Summer}-2021`]: 2,
        [`${Season.Fall}-2020`]: 1,
        [`${Season.Winter}-2021`]: 1,
      });
    });

    it('should sort animeSeason correctly', async () => {
      const stats = await statsService.getStats();
      expect(Object.keys(stats.anime.seasons)[0]).toEqual(
        `${Season.Winter}-2021`,
      );
      expect(Object.keys(stats.anime.seasons)[1]).toEqual(
        `${Season.Summer}-2021`,
      );
      expect(Object.keys(stats.anime.seasons)[2]).toEqual(
        `${Season.Spring}-2021`,
      );
      expect(Object.keys(stats.anime.seasons)[3]).toEqual(
        `${Season.Fall}-2020`,
      );
    });
    it('should filter out undefined and NaNs animeSeason correctly', async () => {
      const stats = await statsService.getStats();
      expect(Object.keys(stats.anime.seasons).length).toEqual(4);
      for (const key in stats.anime.seasons) {
        expect(key).not.toContain(Season.Undefined);
        expect(key).not.toContain('NaN');
      }
    });
  });
  describe('mostUsedTags', () => {
    it('should return mostUsedTags correctly', async () => {
      const stats = await statsService.getStats();
      expect(stats.tags.mostUsedTags).toEqual({
        tag1: 1,
        tag2: 4,
      });
      expect(Object.keys(stats.tags.mostUsedTags)[0]).toEqual('tag2');
    });
    it('should sort mostUsedTags by count correctly', async () => {
      const stats = await statsService.getStats();
      expect(Object.keys(stats.tags.mostUsedTags)[0]).toEqual('tag2');
      expect(Object.keys(stats.tags.mostUsedTags)[1]).toEqual('tag1');

      expect(Object.values(stats.tags.mostUsedTags)[0]).toBeGreaterThan(
        Object.values(stats.tags.mostUsedTags)[1],
      );
    });
  });

  it('should return anime count correctly', async () => {
    const stats = await statsService.getStats();
    expect(stats.anime.count).toEqual(givenData.length);
  });

  it('should return tag count correctly', async () => {
    const stats = await statsService.getStats();
    expect(stats.tags.count).toEqual(givenTags.length);
  });

  it('should return lastDownloaded correctly', async () => {
    const stats = await statsService.getStats();
    expect(stats.lastDownloaded).toEqual(givenLastDownloadedTime);
  });
});
