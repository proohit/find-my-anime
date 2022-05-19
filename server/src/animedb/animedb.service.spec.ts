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
});
