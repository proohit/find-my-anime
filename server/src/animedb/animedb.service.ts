import { Injectable } from '@nestjs/common';
import { getProviders } from '@shared/anime/sources';
import { Provider, ProviderDomain } from '@shared/constants/Provider';
import { Anime } from '@shared/interfaces/AnimeDb';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';

@Injectable()
export class AnimeDbService {
  constructor(
    private animeDbDownloaderService: AnimeDbDownloaderService,
    private readonly animeEnricherService: AnimeEnricherService,
  ) {}

  public async getAnimeById(id: string, provider?: Provider): Promise<Anime> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const animeFromDb = animeDb.data.find((anime) =>
      this.idMatches(id, anime, provider),
    );
    if (this.animeEnricherService.isEnrichable(animeFromDb, provider)) {
      const providers = getProviders(animeFromDb);
      return this.animeEnricherService.enrichAnime(animeFromDb, providers);
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
}
