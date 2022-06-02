import { hasSource } from '@find-my-anime/shared/anime/sources';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime, AnimeDB } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';

@Injectable()
export class AnimeDbService {
  private readonly UPPER_LIMIT = 100;
  constructor(
    private animeDbDownloaderService: AnimeDbDownloaderService,
    private readonly animeEnricherService: AnimeEnricherService,
  ) {}

  public async queryAnime(
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[],
    limit = 20,
  ): Promise<Anime[]> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();

    const foundAnime = this.getMatches(
      animeDb,
      query,
      id,
      provider,
      tags,
    ).slice(0, Math.min(isNaN(limit) ? Infinity : limit, this.UPPER_LIMIT));

    if (
      foundAnime.length === 1 &&
      this.animeEnricherService.isEnrichable(foundAnime[0]) &&
      this.animeEnricherService.needsEnrichment(foundAnime[0])
    ) {
      const enrichedAnime = await this.animeEnricherService.enrichAnime(
        foundAnime[0],
      );
      this.animeDbDownloaderService.updateAnimeEntry(enrichedAnime);
      return [enrichedAnime];
    }
    return foundAnime;
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

  public async getLastDownloaded(): Promise<string> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    return animeDb.lastDownloadTime;
  }

  public async getAllAnime(): Promise<Anime[]> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    return animeDb.data;
  }

  private getMatches(
    animeDb: AnimeDB,
    query: string,
    id: string,
    provider: Provider,
    tags: string[],
  ) {
    let matchedAnimes: Anime[];
    const shouldMatchTitle = !!query;
    if (shouldMatchTitle) {
      const fuse = new Fuse(animeDb.data, {
        keys: ['synonyms', 'title'],
        shouldSort: true,
        threshold: 0.5,
        isCaseSensitive: false,
        findAllMatches: true,
      });
      matchedAnimes = fuse
        .search({
          $or: [{ title: query }, { synonyms: query }],
        })
        .map((result) => result.item);
    }
    matchedAnimes = (shouldMatchTitle ? matchedAnimes : animeDb.data).filter(
      (anime) => this.strictMatches(anime, id, provider, tags),
    );
    return matchedAnimes;
  }

  private strictMatches(
    anime: Anime,
    id?: string,
    provider?: Provider,
    tags?: string[],
  ): boolean {
    let matches = true;
    if (id && !this.idMatches(anime, id, provider)) {
      return false;
    }
    if (provider) {
      matches = this.providerMatches(anime, provider) && matches;
    }
    if (tags) {
      matches = this.tagsMatch(anime, tags) && matches;
    }
    return matches;
  }

  private providerMatches(anime: Anime, provider: Provider): boolean {
    return hasSource(anime, provider);
  }

  private tagsMatch(anime: Anime, tags: string[]) {
    return tags?.every((tag) => anime?.tags.includes(tag));
  }

  private idMatches(anime: Anime, id: string, provider?: Provider): boolean {
    const sources = anime.sources;
    if (sources) {
      if (provider) {
        const providerDomain = ProviderDomain[provider];
        const foundSource = sources.find((source) =>
          source.includes(providerDomain),
        );
        if (foundSource) {
          const sourceId = foundSource.split('/').pop();
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
