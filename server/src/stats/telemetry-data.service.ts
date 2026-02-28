import { TelemetryEntry } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TelemetryDataModel } from '../animedb/schemas/telemetry-data.schema';

@Injectable()
export class TelemetryDataService {
  constructor(
    @InjectModel(TelemetryDataModel.name)
    private readonly telemetryDataModel: Model<TelemetryDataModel>,
  ) {}

  public async incrementTelemetryEntry(newEntry: TelemetryEntry) {
    const filter: FilterQuery<TelemetryDataModel> = {
      data: newEntry.data,
    };
    if (newEntry.source) {
      filter.source = newEntry.source;
    }

    const updateResult = await this.telemetryDataModel.updateOne(filter, {
      $inc: { count: 1 },
    });

    if (updateResult.matchedCount === 0) {
      await this.telemetryDataModel.create(newEntry);
    }
  }

  public async getTelemetryData(): Promise<TelemetryEntry[]> {
    const telemetryData = await this.telemetryDataModel
      .find({}, { _id: 0, count: 1, source: 1, data: 1 })
      .exec();
    return telemetryData;
  }
}
