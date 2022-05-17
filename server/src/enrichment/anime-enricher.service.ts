import { Injectable } from '@nestjs/common';
import {
  Anime,
  getProviderId,
  getProviders,
  Provider,
} from 'find-my-anime-shared';
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
