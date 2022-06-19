import { getProviderIdOfAnime } from '@find-my-anime/shared/anime/id';
import { getProviders, hasSource } from '@find-my-anime/shared/anime/sources';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AniDbClient } from '../api-clients/anidb-client.service';
import { AnilistClient } from '../api-clients/anilist-client.service';
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
    const enrichedAnime = { ...anime };
    const providersToUse = providers || getProviders(anime);
    if (providersToUse.includes(Provider.AniDB)) {
      if (
        !this.configService.get('ANIDB_CLIENT_ID') ||
        !this.configService.get('ANIDB_CLIENT_VERSION')
      ) {
        Logger.warn(
          'ANIDB_CLIENT_ID or ANIDB_CLIENT_VERSION not set, skipping AniDB enrichment',
        );
        return enrichedAnime;
      }
      const aniDbId = getProviderIdOfAnime(anime, Provider.AniDB);
      if (aniDbId) {
        const aniDbData = await this.aniDbClient.getAnime(aniDbId);
        if (aniDbData) {
          enrichedAnime.description = aniDbData.description;
          Logger.log(`Enriched anime ${anime.title} with AniDb`);
        }
      }
    } else if (providersToUse.includes(Provider.Anilist)) {
      const providerId = getProviderIdOfAnime(anime, Provider.Anilist);
      const animeFromAnilist = await this.anilistClient.getAnime(providerId);
      if (animeFromAnilist) {
        enrichedAnime.description = animeFromAnilist.description;
        Logger.log(`Enriched anime ${anime.title} with Anilist`);
      }
    } else if (providersToUse.includes(Provider.MyAnimeList)) {
      if (!this.configService.get('MYANIMELIST_API_KEY')) {
        Logger.warn('MyAnimeList API key not set, skipping enrichment');
        return enrichedAnime;
      }
      const providerId = getProviderIdOfAnime(anime, Provider.MyAnimeList);
      const animeFromMyAnimeList = await this.myAnimeListClient.getAnime(
        providerId,
        ['synopsis'],
      );
      if (animeFromMyAnimeList) {
        enrichedAnime.description = animeFromMyAnimeList.description;
        Logger.log(`Enriched anime ${anime.title} with MyAnimeList`);
      }
    }
    return enrichedAnime;
  }

  public needsEnrichment(anime: Anime): boolean {
    return !anime.description;
  }
}
