import {
  getProviderIdMappings,
  getProviderSourceMappings,
} from '@find-my-anime/shared/anime/sources';
import { ADULT_TAGS } from '@find-my-anime/shared/anime/tags';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { AnimeDocument, AnimeModel } from './schemas/anime.schema';

export interface FilterCriteria {
  query?: string;
  id?: string;
  provider?: Provider;
  tags?: string[];
  excludedTags?: string[];
  includeAdult?: boolean;
}

export type LimitedFilterCriteria = FilterCriteria & { limit: number };
export type MaybeLimitedFilterCriteria = FilterCriteria & { limit?: number };
@Injectable()
export class AnimeSearchService {
  constructor(
    @InjectModel(AnimeModel.name)
    private readonly animeModel: Model<AnimeDocument>,
  ) {
    this.initializeSearchIndex()
      .then(() => {
        Logger.log('Anime Search index initialized');
      })
      .catch((error) => {
        Logger.error('Error initializing Anime Search index:', error);
      });
  }

  public async getAllAnime(): Promise<Anime[]> {
    return this.animeModel.find({}).lean().exec();
  }

  public async findAnime({
    query,
    id,
    provider,
    tags,
    excludedTags,
    includeAdult,
    limit,
  }: LimitedFilterCriteria): Promise<Anime[]> {
    const conditions: FilterQuery<AnimeModel>[] = [];

    const escapedId = id ? this.escapeRegExp(id) : null;
    const providerDomain = provider
      ? this.escapeRegExp(ProviderDomain[provider])
      : null;

    if (provider && escapedId) {
      conditions.push({
        [`providerIdMapping.${provider}`]: `${escapedId}`,
      });
    }

    if (!provider && escapedId) {
      conditions.push({
        $or: Object.values(Provider).map((prov) => ({
          [`providerIdMapping.${prov}`]: `${escapedId}`,
        })),
      });
    }

    if (provider && !escapedId) {
      conditions.push({
        [`providerMapping.${provider}`]: {
          $regex: providerDomain,
          $options: 'i',
        },
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

    const searchCondition: PipelineStage.Search = {
      $search: {
        index: 'titleSynonymsIndex',
        compound: {
          should: [
            {
              text: {
                query,
                path: 'title',
              },
            },
            {
              text: {
                query,
                path: 'synonyms',
              },
            },
          ],
        },
      },
    };

    const pipeline: PipelineStage[] = [];
    if (query) {
      pipeline.push(searchCondition);
    }
    if (conditions.length) {
      pipeline.push({ $match: { $and: conditions } });
    }
    pipeline.push({ $limit: limit });
    pipeline.push({ $project: { _id: 0 } });
    Logger.debug(`Search conditions: ${JSON.stringify(pipeline)}`);
    return this.animeModel.aggregate<Anime>(pipeline).exec();
  }

  private async initializeSearchIndex() {
    await this.createSearchIndexIfNeeded();
    await this.createProviderMappings();
  }

  private async createProviderMappings() {
    const anime = await this.animeModel.findOne();
    if (anime?.providerMapping || anime?.providerIdMapping) {
      Logger.log(`Provider mappings may already exist, skipping creation`);
      return;
    }

    const batchSize = 500;
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const animeBatch = await this.animeModel
        .find({})
        .skip(skip)
        .limit(batchSize)
        .exec();

      if (animeBatch.length === 0) {
        hasMore = false;
        break;
      }

      const bulkOps = animeBatch.map((anime) => {
        return {
          updateOne: {
            filter: { _id: anime._id },
            update: {
              $set: {
                providerIdMapping: getProviderIdMappings(anime),
                providerMapping: getProviderSourceMappings(anime),
              },
            },
          },
        };
      });

      await this.animeModel.bulkWrite(bulkOps, { ordered: false });
      Logger.debug(
        `Updated provider mappings for batch of ${animeBatch.length} anime`,
      );

      skip += batchSize;
    }
  }

  private async createSearchIndexIfNeeded() {
    const indexes = await this.animeModel.listSearchIndexes();
    const searchIndexExists = indexes.some(
      (index) => index.name === 'titleSynonymsIndex',
    );
    if (!searchIndexExists) {
      const index = {
        name: 'titleSynonymsIndex',
        definition: {
          mappings: {
            dynamic: false,
            fields: {
              title: {
                type: 'string',
              },
              synonyms: {
                type: 'string',
              },
            },
          },
        },
      };

      return this.animeModel.createSearchIndex(index);
    }
  }

  private escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
