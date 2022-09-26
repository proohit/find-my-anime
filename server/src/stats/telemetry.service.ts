import { TelemetryEntry } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { AnimeDbDownloaderService } from '../animedb/animedb-downloader.service';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly animeDbDownloaderService: AnimeDbDownloaderService,
  ) {}

  async saveTelemetryEntry(newEntry: TelemetryEntry) {
    await this.getAnimeDbWithTelemetry();
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const existingQueryEntry = await this.getTelemetryEntry(newEntry);
    if (existingQueryEntry && existingQueryEntry.count) {
      existingQueryEntry.count = existingQueryEntry.count + 1;
    } else {
      animeDb.telemetry.push({ ...newEntry, count: 1 });
    }
    await this.animeDbDownloaderService.saveAnimeDb(animeDb);
  }

  public async getAnimeDbWithTelemetry() {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    if (!animeDb.telemetry) {
      animeDb.telemetry = [];
    }
    await this.animeDbDownloaderService.saveAnimeDb(animeDb);
    return animeDb;
  }

  private async getTelemetryEntry(searchEntry: Partial<TelemetryEntry>) {
    const animeDb = await this.getAnimeDbWithTelemetry();
    const existingQueryEntry = animeDb.telemetry.find((someEntry) => {
      if (someEntry.source) {
        return (
          someEntry.source === searchEntry.source &&
          someEntry.data === searchEntry.data
        );
      }
      return someEntry.data === searchEntry.data;
    });
    return existingQueryEntry;
  }
}
