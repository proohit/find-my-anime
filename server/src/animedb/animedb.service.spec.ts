import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAnimeDb } from '../../test/mockData';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDbService } from './animedb.service';

describe('AnimeDbService', () => {
  let animeDbService: AnimeDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeDbService,
        {
          provide: AnimeDbDownloaderService,
          useValue: {
            getAnimeDb: () => Promise.resolve(mockAnimeDb),
          },
        },
        {
          provide: AnimeEnricherService,
          useValue: {
            isEnrichable: () => false,
            enrichAnime: (anime: Anime) => Promise.resolve(anime),
          },
        },
      ],
    }).compile();

    animeDbService = module.get<AnimeDbService>(AnimeDbService);
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
      const results = await animeDbService.queryAnime(
        undefined,
        givenSynonym,
        undefined,
        undefined,
        undefined,
      );
      expect(results.length).not.toBe(0);
      expect(results[0].synonyms).toInclude(givenSynonym);
    });
  });
});
