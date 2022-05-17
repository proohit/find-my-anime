import { Injectable } from '@nestjs/common';
import {
  Anime,
  getProviders,
  hasSource,
  ProviderDomain,
  Provider,
} from 'find-my-anime-shared';
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
  public async queryAnime(
    query: string,
    provider?: Provider,
  ): Promise<Anime[]> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const animesFromDb = animeDb.data.filter((anime) =>
      this.queryMatches(anime, query, provider),
    );
    return animesFromDb;
    // for (let i = 0; i < animesFromDb.length; i++) {
    //   const providers = getProviders(animesFromDb[i]);
    //   if (this.animeEnricherService.isEnrichable(animesFromDb[i], provider)) {
    //     animesFromDb[i] = await this.animeEnricherService.enrichAnime(
    //       animesFromDb[i],
    //       providers,
    //     );
    //   }
    // }
    // return animesFromDb;
  }

  private queryMatches(
    anime: Anime,
    query: string,
    provider?: Provider,
  ): boolean {
    const queryMatches =
      anime.title.toLowerCase().includes(query.toLowerCase()) ||
      anime.synonyms?.some((synonym) =>
        synonym.toLowerCase().includes(query.toLowerCase()),
      );
    if (provider) {
      return hasSource(anime, provider) && queryMatches;
    }
    return queryMatches;
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
