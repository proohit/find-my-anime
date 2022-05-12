import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class AnimeDbDownloaderService {
  private readonly ANIME_OFFLINE_DB_FILE_PATH = './anime-offline-database.json';
  private readonly ANIME_OFFLINE_DB_FILE_URL =
    'https://github.com/manami-project/anime-offline-database/raw/master/anime-offline-database-minified.json';
  private animeDbCache;
  public async getAnimeDb(): Promise<any> {
    if (this.animeDbCache) {
      if (this.shouldUpdateAnimeDb(this.animeDbCache)) {
        this.animeDbCache = await this.downloadAnimeDb();
      }
      return this.animeDbCache;
    }

    let animeDb;
    if (!this.localDbExists()) {
      Logger.log("Local DB doesn't exist. Downloading anime db...");
      animeDb = await this.downloadAnimeDb();
    } else {
      animeDb = await this.loadLocalDb();
    }
    if (this.shouldUpdateAnimeDb(animeDb)) {
      animeDb = await this.downloadAnimeDb();
    }
    this.animeDbCache = animeDb;
    return animeDb;
  }

  private async downloadAnimeDb(): Promise<any> {
    const animeDb = await this.fetchAnimeDb();
    animeDb['lastDownloadTime'] = new Date().toISOString();
    await this.saveAnimeDb(animeDb);
    return animeDb;
  }

  private async loadLocalDb() {
    const animeDb = await readFile(this.ANIME_OFFLINE_DB_FILE_PATH, 'utf8');
    return JSON.parse(animeDb);
  }

  private async fetchAnimeDb(): Promise<any> {
    const res = await axios.get(this.ANIME_OFFLINE_DB_FILE_URL);
    return res.data;
  }

  private async saveAnimeDb(animeDb: any): Promise<void> {
    await writeFile(this.ANIME_OFFLINE_DB_FILE_PATH, JSON.stringify(animeDb));
  }

  private shouldUpdateAnimeDb(animeDb: any) {
    const lastDownloadTime = new Date(animeDb['lastDownloadTime']).getTime();
    const currentTime = new Date().getTime();
    const maxAge = 1000 * 60 * 60 * 24 * 5; // 5 days
    return currentTime - lastDownloadTime > maxAge;
  }

  private localDbExists() {
    return existsSync(this.ANIME_OFFLINE_DB_FILE_PATH);
  }
}
