import { TelemetryEntry } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { TelemetryDataService } from 'src/animedb/telemetry-data.service';

@Injectable()
export class TelemetryService {
  constructor(private readonly telemetryDataService: TelemetryDataService) {}

  async saveTelemetryEntry(newEntry: TelemetryEntry) {
    await this.telemetryDataService.incrementTelemetryEntry(newEntry);
  }

  public async getAnimeDbWithTelemetry() {
    return this.telemetryDataService.getTelemetryData();
  }
}
