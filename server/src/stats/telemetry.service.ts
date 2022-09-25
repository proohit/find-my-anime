import { TelemetryEntry } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { AnimeDbDownloaderService } from '../animedb/animedb-downloader.service';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly animeDbDownloaderService: AnimeDbDownloaderService,
  ) {}

  async saveTelemetryEntry(newEntry: TelemetryEntry) {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    const telemetry = await this.getTelemetry();
    const existingQueryEntry = await this.getTelemetryEntry({
      data: newEntry.data,
    });
    if (existingQueryEntry && existingQueryEntry.count) {
      existingQueryEntry.count = existingQueryEntry.count + 1;
    } else {
      telemetry.push({ ...newEntry, count: 1 });
    }
    await this.animeDbDownloaderService.saveAnimeDb(animeDb);
  }

  public async getTelemetry() {
    const animeDb = await this.animeDbDownloaderService.getAnimeDb();
    if (!animeDb.telemetry) {
      animeDb.telemetry = [];
    }
    await this.animeDbDownloaderService.saveAnimeDb(animeDb);
    return animeDb.telemetry;
  }

  private async getTelemetryEntry(searchEntry: Partial<TelemetryEntry>) {
    const telemetry = await this.getTelemetry();
    const existingQueryEntry = telemetry.find(
      (someEntry) =>
        someEntry.data === searchEntry.data &&
        someEntry.source === searchEntry.source,
    );
    return existingQueryEntry;
  }
}
