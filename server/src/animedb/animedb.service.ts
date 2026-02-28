import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';
import { ADULT_TAGS } from '@find-my-anime/shared/anime/tags';
import {
  Provider,
  ProviderDomain,
} from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeDbDownloaderService } from './animedb-downloader.service';
import { AnimeDocument, AnimeModel } from './schemas/anime.schema';
import { MetadataService } from './metadata.service';

@Injectable()
export class AnimeDbService {
  private readonly UPPER_LIMIT = 100;

  constructor(
    private animeDbDownloaderService: AnimeDbDownloaderService,
    private metadataService: MetadataService,
    private readonly animeEnricherService: AnimeEnricherService,
    @InjectModel(AnimeModel.name)
    private readonly animeModel: Model<AnimeDocument>,
  ) {}

  public async queryAnime(
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[],
    excludedTags?: string[],
    includeAdult?: boolean,
    limit = 20,
  ): Promise<Anime[]> {
    const foundAnime = await this.findAnime(
      Math.min(isNaN(limit) ? 20 : limit, this.UPPER_LIMIT),
      query,
      id,
      provider,
      tags,
      excludedTags,
      includeAdult,
    );

    if (
      foundAnime.length === 1 &&
      this.animeEnricherService.isEnrichable(foundAnime[0]) &&
      this.animeEnricherService.needsEnrichment(foundAnime[0])
    ) {
      const enrichedAnime = await this.animeEnricherService.enrichAnime(
        foundAnime[0],
      );
      await this.animeDbDownloaderService.updateAnimeEntry(enrichedAnime);
      return [enrichedAnime];
    }

    foundAnime.forEach((anime) => {
      const providerIdMapping = this.generateProviderIdMapping(anime);
      anime.providerMapping = providerIdMapping;
    });
    return foundAnime;
  }

  public getTags(): Promise<string[]> {
    return this.animeModel
      .distinct('tags', {
        tags: {
          $ne: null,
        },
      })
      .exec();
  }

  public async getLastDownloaded(): Promise<string> {
    const metadata = await this.metadataService.getMetadata();
    return metadata?.lastDownload ?? '';
  }

  public async getAllAnime(): Promise<Anime[]> {
    return this.animeModel.find({}).lean().exec();
  }

  private async findAnime(
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
}
