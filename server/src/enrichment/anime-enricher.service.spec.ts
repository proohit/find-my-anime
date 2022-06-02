import { getProviderIdOfAnime } from '@find-my-anime/shared/anime/id';
import { getProviders } from '@find-my-anime/shared/anime/sources';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Test, TestingModule } from '@nestjs/testing';
import { emptyAnime, mockAnimeDb } from '../../test/mockData';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { AnimeEnricherService } from './anime-enricher.service';

describe('AnimeEnricherbService', () => {
  let anilistClient: AnilistClient;
  let animeEnricherService: AnimeEnricherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeEnricherService,
        {
          provide: AnilistClient,
          useValue: {
            queryMedia: () => Promise.resolve({ description: 'test' }),
          },
        },
      ],
    }).compile();
    anilistClient = module.get<AnilistClient>(AnilistClient);
    animeEnricherService =
      module.get<AnimeEnricherService>(AnimeEnricherService);
  });

  describe('enrichAnime', () => {
    it('should enrich anime', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.Anilist}/1234`],
      };
      const enrichedAnime = await animeEnricherService.enrichAnime(anime);
      expect(enrichedAnime.description).toEqual('test');
    });

    it('should enrich anime with anilist', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.Anilist}/1234`],
      };
      const enrichedAnime = await animeEnricherService.enrichAnime(anime, [
        Provider.Anilist,
      ]);
      expect(enrichedAnime.description).toEqual('test');
    });
  });

  describe('isEnrichable', () => {
    it('should return true if the anime has anilist', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.Anilist}/1234`],
      };
      expect(animeEnricherService.isEnrichable(anime)).toBeTruthy();
    });

    it('should return true if the provider is anilist', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.Anilist}/1234`],
      };
      expect(
        animeEnricherService.isEnrichable(anime, Provider.Anilist),
      ).toBeTruthy();
    });
  });

  describe('needsEnrichment', () => {
    it('should return true if the anime has no description', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.Anilist}/1234`],
      };
      expect(animeEnricherService.needsEnrichment(anime)).toBeTruthy();
    });
  });
});
