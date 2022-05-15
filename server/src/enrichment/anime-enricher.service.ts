import { Injectable } from '@nestjs/common';
import { getProviderId, getProviders } from '@shared/anime/sources';
import { Provider } from '@shared/constants/Provider';
import { Anime } from '@shared/interfaces/AnimeDb';
import { AnilistClient } from '../anilist-client.service';

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
    if (providers.includes(Provider.Anilist)) {
      const providerId = getProviderId(anime, Provider.Anilist);
      const animeFromAnilist = await this.anilistClient.queryMedia(providerId);
      if (animeFromAnilist) {
        enrichedAnime.description = animeFromAnilist.description;
        enrichedAnime.provider = Provider.Anilist;
      }
    }
    return enrichedAnime;
  }
}
