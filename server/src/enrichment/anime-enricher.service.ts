import { getProviderIdOfAnime } from '@find-my-anime/shared/anime/id';
import { getProviders, hasSource } from '@find-my-anime/shared/anime/sources';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AniDbClient } from '../api-clients/anidb-client.service';
import { AnilistClient } from '../api-clients/anilist-client.service';
import { AnimeClient } from '../api-clients/AnimeClient';
import { MyAnimeListClient } from '../api-clients/myanimelist-client.service';

@Injectable()
export class AnimeEnricherService {
  constructor(
    private readonly anilistClient: AnilistClient,
    private readonly myAnimeListClient: MyAnimeListClient,
    private readonly aniDbClient: AniDbClient,
    private readonly configService: ConfigService,
  ) {}
  private readonly ENRICHABLE_PROVIDERS = [
    Provider.Anilist,
    Provider.MyAnimeList,
    Provider.AniDB,
  ];
  public isEnrichable(anime: Anime, provider?: Provider): boolean {
    if (
      provider &&
      this.ENRICHABLE_PROVIDERS.includes(provider) &&
      hasSource(anime, provider)
    ) {
      return true;
    }
    const providers = getProviders(anime);
    return this.ENRICHABLE_PROVIDERS.some((prov) => providers.includes(prov));
  }

  public async enrichAnime(
    anime: Anime,
    providers?: Provider[],
  ): Promise<Anime> {
    let enrichedAnime = { ...anime };
    const providersToUse = providers || getProviders(anime);

    enrichedAnime = this.getProviderMappingEnrichedAnime(enrichedAnime);

    if (providersToUse.includes(Provider.Anilist)) {
      enrichedAnime = await this.getAnilistEnrichedAnime(enrichedAnime);
    }

    if (providersToUse.includes(Provider.MyAnimeList)) {
      enrichedAnime = await this.getMyAnimeListEnrichedAnime(enrichedAnime);
    }

    if (providersToUse.includes(Provider.AniDB)) {
      enrichedAnime = await this.getAnidbEnrichedAnime(enrichedAnime);
    }

    return enrichedAnime;
  }

  public needsEnrichment(anime: Anime): boolean {
    return !anime.description || !anime.providerMapping;
  }

  private getProviderMappingEnrichedAnime(anime: Anime): Anime {
    if (anime.providerMapping) {
      return anime;
    }

    const providers = getProviders(anime);

    anime.providerMapping = providers.reduce((acc, provider) => {
      const providerId = getProviderIdOfAnime(anime, provider);
      return {
        ...acc,
        [provider]: providerId,
      };
    }, {});
    return anime;
  }

  private async getAnidbEnrichedAnime(anime: Anime): Promise<Anime> {
    if (
      !this.configService.get('ANIDB_CLIENT_ID') ||
      !this.configService.get('ANIDB_CLIENT_VERSION')
    ) {
      Logger.warn(
        'ANIDB_CLIENT_ID or ANIDB_CLIENT_VERSION not set, skipping AniDB enrichment',
      );
      return anime;
    }
    return this.getEnrichedAnimeByClient(
      anime,
      this.aniDbClient,
      Provider.AniDB,
    );
  }

  private async getAnilistEnrichedAnime(anime: Anime): Promise<Anime> {
    return this.getEnrichedAnimeByClient(
      anime,
      this.anilistClient,
      Provider.Anilist,
    );
  }

  private async getMyAnimeListEnrichedAnime(anime: Anime): Promise<Anime> {
    if (!this.configService.get('MYANIMELIST_API_KEY')) {
      Logger.warn('MyAnimeList API key not set, skipping enrichment');
      return anime;
    }
    return this.getEnrichedAnimeByClient(
      anime,
      this.myAnimeListClient,
      Provider.MyAnimeList,
      ['synopsis'],
    );
  }

  private async getEnrichedAnimeByClient(
    anime: Anime,
    client: AnimeClient,
    provider: Provider,
    externalFields?: string[],
  ): Promise<Anime> {
    if (!this.needsEnrichment(anime)) {
      return anime;
    }
    const providerId = getProviderIdOfAnime(anime, provider);
    const animeFromClient = await client.getAnime(providerId, externalFields);
    if (animeFromClient) {
      Logger.log(`Enriched anime ${anime.title} with ${provider}`);
      return { ...anime, description: animeFromClient.description };
    }
    Logger.error(`Failed to enrich anime ${anime.title} with ${provider}`);
    return anime;
  }
}
