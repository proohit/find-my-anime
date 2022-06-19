import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { emptyAnime } from '../../test/mockData';
import { AniDbClient } from '../api-clients/anidb-client.service';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { MyAnimeListClient } from '../api-clients/myanimelist-client.service';
import { AnimeEnricherService } from './anime-enricher.service';

describe('AnimeEnricherbService', () => {
  let configService: ConfigService;
  let animeEnricherService: AnimeEnricherService;
  let anilistClient: AnilistClient;
  let myAnimeListClient: MyAnimeListClient;
  let aniDbClient: AniDbClient;

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
          provide: AniDbClient,
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
    configService = module.get<ConfigService>(ConfigService);
    animeEnricherService =
      module.get<AnimeEnricherService>(AnimeEnricherService);
    anilistClient = module.get<AnilistClient>(AnilistClient);
    myAnimeListClient = module.get<MyAnimeListClient>(MyAnimeListClient);
    aniDbClient = module.get<AniDbClient>(AniDbClient);
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

    it('should enrich anime with anidb', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.AniDB}/1234`],
      };
      const enrichedAnime = await animeEnricherService.enrichAnime(anime, [
        Provider.AniDB,
      ]);
      expect(enrichedAnime.description).toEqual('test');
    });

    it('should not enrich anime with anidb if client and client version are missing', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.AniDB}/1234`],
      };
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      const enrichedAnime = await animeEnricherService.enrichAnime(anime, [
        Provider.AniDB,
      ]);
      expect(enrichedAnime).toEqual(anime);
      expect(enrichedAnime.description).toBeUndefined();
    });

    it('should only enrich with anilist when anilist already enriched', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [
          `${ProviderDomain.Anilist}/1234`,
          `${ProviderDomain.AniDB}/1234`,
          `${ProviderDomain.MyAnimeList}/1234`,
        ],
      };
      const anilistSpy = jest.spyOn(anilistClient, 'getAnime');
      const myAnimeListSpy = jest.spyOn(myAnimeListClient, 'getAnime');
      const aniDbSpy = jest.spyOn(aniDbClient, 'getAnime');
      await animeEnricherService.enrichAnime(anime);
      expect(anilistSpy).toHaveBeenCalled();
      expect(myAnimeListSpy).not.toHaveBeenCalled();
      expect(aniDbSpy).not.toHaveBeenCalled();
    });

    it('should only enrich with myanimelist when anilist did not enrich', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [
          `${ProviderDomain.AniDB}/1234`,
          `${ProviderDomain.MyAnimeList}/1234`,
        ],
      };
      const anilistSpy = jest.spyOn(anilistClient, 'getAnime');
      const myAnimeListSpy = jest.spyOn(myAnimeListClient, 'getAnime');
      const aniDbSpy = jest.spyOn(aniDbClient, 'getAnime');
      await animeEnricherService.enrichAnime(anime);
      expect(anilistSpy).not.toHaveBeenCalled();
      expect(myAnimeListSpy).toHaveBeenCalled();
      expect(aniDbSpy).not.toHaveBeenCalled();
    });

    it('should only enrich with anidb when myanimelist did not enrich', async () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.AniDB}/1234`],
      };
      const anilistSpy = jest.spyOn(anilistClient, 'getAnime');
      const myAnimeListSpy = jest.spyOn(myAnimeListClient, 'getAnime');
      const aniDbSpy = jest.spyOn(aniDbClient, 'getAnime');
      await animeEnricherService.enrichAnime(anime);
      expect(anilistSpy).not.toHaveBeenCalled();
      expect(myAnimeListSpy).not.toHaveBeenCalled();
      expect(aniDbSpy).toHaveBeenCalled();
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

    it('should return true if the anime has myanimelist', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.MyAnimeList}/1234`],
      };
      expect(animeEnricherService.isEnrichable(anime)).toBeTruthy();
    });

    it('should return true if the anime has anidb', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.AniDB}/1234`],
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

    it('should return true if the provider is anidb', () => {
      const anime: Anime = {
        ...emptyAnime,
        sources: [`${ProviderDomain.AniDB}/1234`],
      };
      expect(
        animeEnricherService.isEnrichable(anime, Provider.AniDB),
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
