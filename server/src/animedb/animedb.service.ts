import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetadataService } from './metadata.service';
import { AnimeDocument, AnimeModel } from './schemas/anime.schema';
import { AnimeSearchService } from './anime-search.service';
import { AnimeEnricherService } from 'src/enrichment/anime-enricher.service';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';

@Injectable()
export class AnimeDbService {
  private readonly UPPER_LIMIT = 100;

  constructor(
    private animeSearchService: AnimeSearchService,
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
    const foundAnime = await this.animeSearchService.findAnime(
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
      await this.updateAnimeEntry(enrichedAnime);
      return [enrichedAnime];
    }

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
