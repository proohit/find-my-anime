import { getProviders, hasSource } from '@find-my-anime/shared/anime/sources';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';

@Injectable()
export class AnimeDbService {
  constructor(
    private animeDbDownloaderService: AnimeDbDownloaderService,
    private readonly animeEnricherService: AnimeEnricherService,
  ) {}

  public async queryAnime(
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[],
    limit?: number,
  ): Promise<Anime[]> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const animesFromDb = animeDb.data.filter((anime) =>
      this.queryMatches(anime, id, query, provider, tags),
    );
    return animesFromDb.slice(0, limit || 20);
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
  public async getTags(): Promise<string[]> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const tags = new Set(
      animeDb.data
        .map((anime) => anime.tags)
        .filter((tag) => tag)
        .flat(),
    );
    return [...tags];
  }
  private queryMatches(
    anime: Anime,
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[],
  ): boolean {
    let matches = true;
    if (id && !this.idMatches(id, anime, provider)) {
      return false;
    }
    if (query) {
      matches =
        anime.title.toLowerCase().includes(query.toLowerCase()) ||
        anime.synonyms?.some((synonym) =>
          synonym.toLowerCase().includes(query.toLowerCase()),
        );
    }
    if (provider) {
      matches = hasSource(anime, provider) && matches;
    }
    if (tags) {
      matches = tags?.every((tag) => anime?.tags.includes(tag)) && matches;
    }
    return matches;
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
