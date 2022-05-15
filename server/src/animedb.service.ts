import { Injectable } from '@nestjs/common';
import { Provider, ProviderDomain } from '@shared/constants/Provider';
import { Anime } from '@shared/interfaces/AnimeDb';
import { getProviderId, getProviders } from '@shared/anime/sources';
import { AnilistClient } from './anilist-client.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';

@Injectable()
export class AnimeDbService {
  constructor(
    private animeDbDownloaderService: AnimeDbDownloaderService,
    private readonly anilistClient: AnilistClient,
  ) {}

  public async getAnimeById(id: string, provider?: Provider): Promise<Anime> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const animeFromDb = animeDb.data.find((anime) =>
      this.idMatches(id, anime, provider),
    );
    if (this.isEnrichable(animeFromDb, provider)) {
      const providers = getProviders(animeFromDb);
      return this.enrichAnime(animeFromDb, providers);
    }
    return animeFromDb;
  }

  private idMatches(id: string, anime: Anime, provider?: Provider): boolean {
    const sources = anime.sources;
    if (sources) {
      if (provider) {
        const providerDomain = ProviderDomain[provider];
        const source = sources.find((source) =>
          source.includes(providerDomain),
        );
        if (source) {
          const sourceId = source.split('/').pop();
          return sourceId === id;
        }
      } else {
        const sourcesIds = sources.map((source) => source.split('/').pop());
        return sourcesIds.includes(id);
      }
    }
    return false;
  }

  private isEnrichable(anime: Anime, provider?: Provider): boolean {
    if (provider && provider === Provider.Anilist) {
      return true;
    }
    const providers = getProviders(anime);
    return providers.includes(Provider.Anilist);
  }

  private async enrichAnime(
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
