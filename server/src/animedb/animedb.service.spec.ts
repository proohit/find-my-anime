import { getProviderIdOfAnime } from '@find-my-anime/shared/anime/id';
import { getProviders } from '@find-my-anime/shared/anime/sources';
import { ADULT_TAGS } from '@find-my-anime/shared/anime/tags';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAnimeDb } from '../../test/mockData';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';

describe('AnimeDbService', () => {
  let animeDbService: AnimeDbService;
  let animeDbDownloaderService: AnimeDbDownloaderService;
  let animeEnricherService: AnimeEnricherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeDbService,
        {
          provide: AnimeDbDownloaderService,
          useValue: {
            getAnimeDb: () => Promise.resolve(mockAnimeDb),
            updateAnimeEntry: () => Promise.resolve(),
          },
        },
        {
          provide: AnimeEnricherService,
          useValue: {
            isEnrichable: () => false,
            enrichAnime: (anime: Anime) => Promise.resolve(anime),
            needsEnrichment: () => false,
          },
        },
      ],
    }).compile();
    animeDbService = module.get<AnimeDbService>(AnimeDbService);
    animeDbDownloaderService = module.get<AnimeDbDownloaderService>(
      AnimeDbDownloaderService,
    );
    animeEnricherService =
      module.get<AnimeEnricherService>(AnimeEnricherService);
  });

  describe('tags', () => {
    it('should return all tags', async () => {
      const tags = await animeDbService.getTags();
      const expectedTags = [
        ...new Set(
          mockAnimeDb.data.reduce((acc, curr) => acc.concat(curr.tags), []),
        ),
      ];
      expect(tags).toEqual(expectedTags);
    });
  });

  describe('lastDownloaded', () => {
    it('should return the last downloaded time', async () => {
      const givenLastDownloadedTime = '2020-01-01T00:00:00.000Z';
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          lastDownloadTime: givenLastDownloadedTime,
        }),
      );
      const lastDownloaded = await animeDbService.getLastDownloaded();
      expect(lastDownloaded).toEqual(givenLastDownloadedTime);
    });
  });

  describe('getAllAnime', () => {
    it('should return all anime', async () => {
      const allAnime = await animeDbService.getAllAnime();
      expect(allAnime).toEqual(mockAnimeDb.data);
    });
  });

  describe('search', () => {
    it('should search by id', async () => {
      const results = await animeDbService.queryAnime('51478');
      expect(results).toEqual([mockAnimeDb.data[0]]);
    });

    it('should search by title', async () => {
      const givenTitle = 'sword art online';
      const results = await animeDbService.queryAnime(undefined, givenTitle);
      expect(results.length).not.toBe(0);
      expect(results[0].title.toLowerCase()).toContain(givenTitle);
    });

    it('should search by tag', async () => {
      const givenTag = 'action';
      const results = await animeDbService.queryAnime(
        undefined,
        undefined,
        undefined,
        [givenTag],
      );
      expect(results.length).not.toBe(0);
      expect(results[0].tags).toContain(givenTag);
    });

    it('should search by multiple tags', async () => {
      const givenTags = ['action', 'drama'];
      const results = await animeDbService.queryAnime(
        undefined,
        undefined,
        undefined,
        givenTags,
      );
      expect(results.length).not.toBe(0);
      expect(results[0].tags).toContainValues(givenTags);
    });

    it('should search by multiple tags and title', async () => {
      const givenTags = ['action', 'drama'];
      const givenTitle = 'sword art online';
      const results = await animeDbService.queryAnime(
        undefined,
        givenTitle,
        undefined,
        givenTags,
      );
      expect(results.length).not.toBe(0);
      expect(results[0].tags).toContainValues(givenTags);
      expect(results[0].title.toLowerCase()).toContain(givenTitle);
    });

    it('should search by provider and id', async () => {
      const givenId = '142051';
      const results = await animeDbService.queryAnime(
        givenId,
        undefined,
        Provider.Anilist,
      );
      expect(results).toHaveLength(1);
      expect(results).toEqual([mockAnimeDb.data[0]]);
    });

    it('should search by provider and title', async () => {
      const givenTitle = 'sword art online';
      const results = await animeDbService.queryAnime(
        undefined,
        givenTitle,
        Provider.Anilist,
      );
      expect(results.length).not.toBe(0);
      expect(results[0].title.toLowerCase()).toContain(givenTitle);
    });

    it('should search by synonym', async () => {
      const givenSynonym = 'SAO';
      const results = await animeDbService.queryAnime(undefined, givenSynonym);
      expect(results.length).not.toBe(0);
      expect(results[0].synonyms).toInclude(givenSynonym);
    });

    it('should accept limit', async () => {
      const results = await animeDbService.queryAnime(
        undefined,
        'a',
        undefined,
        undefined,
        undefined,
        1,
      );
      expect(results.length).toBe(1);
    });

    it('should have upper limit of 100', async () => {
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          data: [
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
            ...mockAnimeDb.data,
          ],
        }),
      );
      const results = await animeDbService.queryAnime(
        undefined,
        'a',
        undefined,
        undefined,
        undefined,
        101,
      );
      expect(results.length).toBe(100);
    });

    it('should enrich anime data and save it to the database', async () => {
      const givenAnime = mockAnimeDb.data[0];
      const providerOfAnime = getProviders(givenAnime)[0];
      const animeId = getProviderIdOfAnime(givenAnime, providerOfAnime);
      jest
        .spyOn(animeEnricherService, 'enrichAnime')
        .mockReturnValue(
          Promise.resolve({ ...givenAnime, description: 'test' }),
        );
      jest.spyOn(animeEnricherService, 'isEnrichable').mockReturnValue(true);
      jest.spyOn(animeEnricherService, 'needsEnrichment').mockReturnValue(true);
      const results = await animeDbService.queryAnime(
        animeId,
        undefined,
        providerOfAnime,
      );
      expect(results.length).toBe(1);
      expect(results[0].description).toEqual('test');
    });

    it('should filter out adult anime', async () => {
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          data: [{ ...mockAnimeDb.data[0], tags: [ADULT_TAGS[0]] }],
        }),
      );
      const results = await animeDbService.queryAnime(
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
      expect(results.length).toBe(0);
    });

    it('should include adult anime', async () => {
      jest.spyOn(animeDbDownloaderService, 'getAnimeDb').mockReturnValue(
        Promise.resolve({
          ...mockAnimeDb,
          data: [{ ...mockAnimeDb.data[0], tags: [ADULT_TAGS[0]] }],
        }),
      );
      const results = await animeDbService.queryAnime(
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      expect(results.length).toBe(1);
    });
  });
});
