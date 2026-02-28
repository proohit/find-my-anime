import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnimeDbMetadataModel } from './schemas/anime-metadata.schema';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(AnimeDbMetadataModel.name)
    private readonly metadataModel: Model<AnimeDbMetadataModel>,
  ) {}

  public getMetadata(): Promise<AnimeDbMetadataModel | null> {
    return this.metadataModel.findOne().lean().exec();
  }
}
