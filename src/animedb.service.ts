import { Injectable } from '@nestjs/common';
import { AnimeDbDownloaderService } from './animedb-downloader.service';

@Injectable()
export class AnimeDbService {
  constructor(private animeDbDownloaderService: AnimeDbDownloaderService) {}

  public async getAnimeById(id: string): Promise<any> {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    return animeDb.data.find((anime) => this.idMatches(id, anime));
  }

  private idMatches(id: string, anime: any): boolean {
    const sources = anime.sources;
    if (sources) {
      const sourcesIds = sources.map((source) => source.split('/').pop());
      return sourcesIds.includes(id);
    }
    return false;
  }
}
