import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnimeDbMetadataModel } from './schemas/anime-metadata.schema';
import { AnimeDocument, AnimeModel } from './schemas/anime.schema';

@Injectable()
export class AnimeDbDownloaderService {
  constructor(
    @InjectModel(AnimeModel.name)
    private readonly animeModel: Model<AnimeDocument>,
    @InjectModel(AnimeDbMetadataModel.name)
    private readonly metadataModel: Model<AnimeDbMetadataModel>,
  ) {}

  public async updateAnimeEntry(anime: Anime) {
    const providers = getProviders(anime);
    const source = providers.length ? getSource(anime, providers[0]) : '';
    if (source) {
      await this.animeModel.updateOne(
        { sources: source },
        { $set: anime },
        { upsert: true },
      );
      Logger.log(`Updated anime ${anime.title} in Mongo`);
      return;
    }
    await this.animeModel.create(anime);
    Logger.log(`Inserted anime ${anime.title} in Mongo`);
  }
}
