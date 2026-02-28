import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';
import { ADULT_TAGS } from '@find-my-anime/shared/anime/tags';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AnimeDocument, AnimeModel } from './schemas/anime.schema';

@Injectable()
export class AnimeSearchService {
  constructor(
    @InjectModel(AnimeModel.name)
    private readonly animeModel: Model<AnimeDocument>,
  ) {}

  public async getAllAnime(): Promise<Anime[]> {
    return this.animeModel.find({}).lean().exec();
  }

  public async findAnime(
    limit: number,
    query?: string,
    id?: string,
    provider?: Provider,
    tags?: string[],
    excludedTags?: string[],
    includeAdult?: boolean,
  ): Promise<Anime[]> {
    const conditions: FilterQuery<AnimeModel>[] = [];

    const escapedId = id ? this.escapeRegExp(id) : null;
    const providerDomain = provider
      ? this.escapeRegExp(ProviderDomain[provider])
      : null;

    if (providerDomain && escapedId) {
      const combinedRegex = `^${providerDomain}.*${escapedId}$`;
      conditions.push({
        sources: { $regex: combinedRegex },
      });
    }

    if (!providerDomain && escapedId) {
      conditions.push({
        sources: { $regex: `${escapedId}$` },
      });
    }

    if (providerDomain && !escapedId) {
      conditions.push({
        sources: { $regex: `^${providerDomain}` },
      });
    }

    if (tags?.length) {
      conditions.push({ tags: { $all: tags } });
    }

    if (excludedTags?.length) {
      conditions.push({ tags: { $nin: excludedTags } });
    }

    if (!includeAdult) {
      conditions.push({ tags: { $nin: ADULT_TAGS } });
    }

    return this.animeModel
      .find(
        query
          ? {
              $text: { $search: query },
              $and: conditions,
            }
          : { $and: conditions },
        { _id: 0 },
      )
      .limit(limit)
      .transform((docs) => {
        return docs.map((anime: AnimeDocument) => {
          const animeModel: Anime = { ...anime };
          animeModel.providerMapping =
            this.generateProviderIdMapping(animeModel);
          return animeModel;
        });
      })
      .lean()
      .exec();
  }

  private generateProviderIdMapping(anime: Anime): Record<string, string> {
    const mapping: Record<string, string> = {};
    const providers = getProviders(anime);
    providers.forEach((provider) => {
      const source = getSource(anime, provider);
      if (source) {
        mapping[provider] = source;
      }
    });
    return mapping;
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async updateAnimeEntry(anime: Anime) {
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
