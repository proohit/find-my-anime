import { getProviderIdOfAnime } from '@find-my-anime/shared/anime/id';
import { getProviders } from '@find-my-anime/shared/anime/sources';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { AnilistClient } from '../api-clients/anilist-client.service';

@Injectable()
export class AnimeEnricherService {
  constructor(private readonly anilistClient: AnilistClient) {}

  public isEnrichable(anime: Anime, provider?: Provider): boolean {
    if (provider && provider === Provider.Anilist) {
      return true;
    }
    const providers = getProviders(anime);
    return providers.includes(Provider.Anilist);
  }

  public async enrichAnime(
    anime: Anime,
    providers?: Provider[],
  ): Promise<Anime> {
    const enrichedAnime = { ...anime };
    const providersToUse = providers || getProviders(anime);
    if (providersToUse.includes(Provider.Anilist)) {
      const providerId = getProviderIdOfAnime(anime, Provider.Anilist);
      const animeFromAnilist = await this.anilistClient.queryMedia(providerId);
      if (animeFromAnilist) {
        enrichedAnime.description = animeFromAnilist.description;
        Logger.log(`Enriched anime ${anime.title} with Anilist`);
      }
    }
    return enrichedAnime;
  }

  public needsEnrichment(anime: Anime): boolean {
    return !anime.description;
  }
}
