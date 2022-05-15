import { Injectable } from '@nestjs/common';
import { Provider, ProviderDomain } from '@shared/constants/Provider';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { Anime } from './interfaces/AnimeDb';

@Injectable()
export class AnimeDbService {
  constructor(private animeDbDownloaderService: AnimeDbDownloaderService) {}

  public async getAnimeById(id: string, provider?: Provider): Promise<Anime> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    return animeDb.data.find((anime) => this.idMatches(id, anime, provider));
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
          return source.includes(id);
        }
      } else {
        const sourcesIds = sources.map((source) => source.split('/').pop());
        return sourcesIds.includes(id);
      }
    }
    return false;
  }
}
