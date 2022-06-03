import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { emptyAnime } from '../../test/mockData';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { MyAnimeListClient } from '../api-clients/myanimelist-client.service';
import { AnimeEnricherService } from './anime-enricher.service';

describe('AnimeEnricherbService', () => {
  let anilistClient: AnilistClient;
  let configService: ConfigService;
  let animeEnricherService: AnimeEnricherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeEnricherService,
        {
          provide: AnilistClient,
          useValue: {
            getAnime: () => Promise.resolve({ description: 'test' }),
          },
        },
        {
          provide: MyAnimeListClient,
          useValue: {
            getAnime: () => Promise.resolve({ description: 'test' }),
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
    anilistClient = module.get<AnilistClient>(AnilistClient);
    configService = module.get<ConfigService>(ConfigService);
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

    it('should enrich anime with myanimelist', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.MyAnimeList}/1234`],
      };
      const enrichedAnime = await animeEnricherService.enrichAnime(anime, [
        Provider.MyAnimeList,
      ]);
      expect(enrichedAnime.description).toEqual('test');
    });

    it('should not enrich anime with myanimelist if api key is missing', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.MyAnimeList}/1234`],
      };
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      const enrichedAnime = await animeEnricherService.enrichAnime(anime, [
        Provider.MyAnimeList,
      ]);
      expect(enrichedAnime).toEqual(anime);
      expect(enrichedAnime.description).toBeUndefined();
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

    it('should return true if the anime has anilist', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.MyAnimeList}/1234`],
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

    it('should return true if the provider is myanimelist', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.MyAnimeList}/1234`],
      };
      expect(
        animeEnricherService.isEnrichable(anime, Provider.MyAnimeList),
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
