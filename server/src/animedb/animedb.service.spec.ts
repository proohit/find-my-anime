/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { getProviders, getSource } from '@find-my-anime/shared/anime/sources';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { mockAnimeData, mockAnimeDb } from '../../test/mockData';
import { AnimeEnricherService } from '../enrichment/anime-enricher.service';
import { AnimeSearchService } from './anime-search.service';
import { AnimeDbService } from './animedb.service';
import { MetadataService } from './metadata.service';
import { AnimeModel } from './schemas/anime.schema';

describe('AnimeDbService', () => {
  let animeDbService: AnimeDbService;
  let animeEnricherService: AnimeEnricherService;
  let animeModel: Model<AnimeModel>;
  let metadataService: MetadataService;
  let animeSearchService: jest.Mocked<AnimeSearchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeDbService,

        {
          provide: AnimeEnricherService,
          useValue: {
            isEnrichable: () => false,
            enrichAnime: (anime: Anime) => Promise.resolve(anime),
            needsEnrichment: () => false,
          },
        },
        {
          provide: getModelToken(AnimeModel.name),
          useValue: {
            find: () => ({
              lean: () => ({
                exec: () => Promise.resolve(mockAnimeData),
              }),
            }),
            updateOne: jest.fn(),
          },
        },
        {
          provide: MetadataService,
          useValue: {
            getMetadata: jest.fn().mockResolvedValue({
              lastDownloadTime: '2020-01-01T00:00:00.000Z',
            }),
          },
        },
        {
          provide: AnimeSearchService,
          useValue: {
            findAnime: jest.fn().mockResolvedValue(mockAnimeDb.data),
          },
        },
      ],
    }).compile();
    animeDbService = module.get(AnimeDbService);
    animeEnricherService = module.get(AnimeEnricherService);
    animeModel = module.get(getModelToken(AnimeModel.name));
    metadataService = module.get(MetadataService);
    animeSearchService = module.get(AnimeSearchService);
  });

  describe('tags', () => {
    it('should return all tags', async () => {
      const givenTags = ['action', 'drama', 'comedy'];
      animeModel.distinct = jest
        .fn()
        .mockReturnValue({ exec: () => givenTags });

      const tags = await animeDbService.getTags();
      expect(tags).toEqual(givenTags);
    });
  });

  describe('lastDownloaded', () => {
    it('should return the last downloaded time', async () => {
      const givenLastDownloadedTime = '2020-01-01T00:00:00.000Z';
      jest.spyOn(metadataService, 'getMetadata').mockResolvedValue({
        lastDownload: givenLastDownloadedTime,
      });
      const lastDownloaded = await animeDbService.getLastDownloaded();
      expect(lastDownloaded).toEqual(givenLastDownloadedTime);
    });
  });

  describe('getAllAnime', () => {
    it('should return all anime', async () => {
      const allAnime = await animeDbService.getAllAnime();
      expect(allAnime).toEqual(mockAnimeData);
    });
  });

  describe('queryAnime', () => {
    it('should search with SearchService', async () => {
      await animeDbService.queryAnime();
      expect(animeSearchService.findAnime).toHaveBeenCalled();
    });

    it('should search with title', async () => {
      const givenTitle = 'sword art online';
      await animeDbService.queryAnime(undefined, givenTitle);
      expect(animeSearchService.findAnime).toHaveBeenCalledWith(
        givenTitle,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expect.anything(),
      );
    });

    it('should set upperlimit', async () => {
      await animeDbService.queryAnime(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        101,
      );
      expect(animeSearchService.findAnime).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        100,
      );
    });

    it('should enrich anime data and save it to the database', async () => {
      const mockEnrichedAnime = {
        ...mockAnimeData[0],
        description: 'test description',
      };
      animeSearchService.findAnime.mockResolvedValueOnce([mockEnrichedAnime]);

      jest
        .spyOn(animeEnricherService, 'enrichAnime')
        .mockResolvedValue(mockEnrichedAnime);
      jest.spyOn(animeEnricherService, 'isEnrichable').mockReturnValue(true);
      jest.spyOn(animeEnricherService, 'needsEnrichment').mockReturnValue(true);
      await animeDbService.queryAnime(undefined, undefined, undefined);
      expect(animeEnricherService.enrichAnime).toHaveBeenCalled();
      expect(animeModel.updateOne).toHaveBeenCalledWith(
        {
          sources: getSource(
            mockAnimeData[0],
            getProviders(mockAnimeData[0])[0],
          ),
        },
        {
          $set: expect.objectContaining({
            description: mockEnrichedAnime.description,
          }),
        },
      );
    });
  });
});
