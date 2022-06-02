import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';
import { ANIME_OFFLINE_DB_FILE_URL } from '@find-my-anime/shared/constants/urls';
import { Anime, AnimeDB } from '@find-my-anime/shared/interfaces/AnimeDb';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AnimeDbDownloaderService {
  private readonly ANIME_OFFLINE_DB_FILE_PATH = './anime-offline-database.json';
  private animeDbCache: AnimeDB;

  constructor(private httpService: HttpService) {}

  public async getAnimeDb(): Promise<AnimeDB> {
    if (this.animeDbCache) {
      if (this.shouldUpdateAnimeDb(this.animeDbCache)) {
        this.animeDbCache = await this.downloadAnimeDb();
      }
      return this.animeDbCache;
    }

    let animeDb: AnimeDB;
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

  public async updateAnimeEntry(anime: Anime) {
    const animeDb = await this.getAnimeDb();
    const providers = getProviders(anime);
    const source = getSource(anime, providers[0]);
    const animeIndex = animeDb.data.findIndex((animeFromDb) =>
      animeFromDb.sources.includes(source),
    );
    if (animeIndex >= 0) {
      animeDb.data[animeIndex] = anime;
    }
    Logger.log(`Updated anime ${anime.title} in local db`);
    await this.saveAnimeDb(animeDb);
    this.animeDbCache = animeDb;
  }

  private async downloadAnimeDb(): Promise<AnimeDB> {
    const animeDb = await this.fetchAnimeDb();
    animeDb['lastDownloadTime'] = new Date().toISOString();
    await this.saveAnimeDb(animeDb);
    return animeDb;
  }

  private async loadLocalDb() {
    const animeDb = await readFile(this.ANIME_OFFLINE_DB_FILE_PATH, 'utf8');
    return JSON.parse(animeDb);
  }

  private async fetchAnimeDb(): Promise<AnimeDB> {
    const res = await lastValueFrom(
      this.httpService.get(ANIME_OFFLINE_DB_FILE_URL),
    );
    return res.data;
  }

  private async saveAnimeDb(animeDb: any): Promise<void> {
    await writeFile(this.ANIME_OFFLINE_DB_FILE_PATH, JSON.stringify(animeDb));
  }

  private shouldUpdateAnimeDb(animeDb: AnimeDB) {
    const lastDownloadTime = new Date(animeDb.lastDownloadTime).getTime();
    const currentTime = new Date().getTime();
    const maxAge = 1000 * 60 * 60 * 24 * 5; // 5 days
    return currentTime - lastDownloadTime > maxAge;
  }

  private localDbExists() {
    return existsSync(this.ANIME_OFFLINE_DB_FILE_PATH);
  }
}
