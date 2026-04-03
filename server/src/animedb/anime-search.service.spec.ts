/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ADULT_TAGS } from '@find-my-anime/shared/anime/tags';
import { Provider } from '@find-my-anime/shared/constants/Provider';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { mockAnimeData } from '../../test/mockData';
import { AnimeSearchService } from './anime-search.service';
import { AnimeModel } from './schemas/anime.schema';

describe('AnimeSearchService', () => {
  let animeSearchService: AnimeSearchService;
  let animeModel: Model<AnimeModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeSearchService,
        {
          provide: getModelToken(AnimeModel.name),
          useValue: {
            aggregate: () => ({
              exec: () => Promise.resolve(mockAnimeData),
            }),
            listSearchIndexes: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();
    animeSearchService = module.get(AnimeSearchService);
    animeModel = module.get(getModelToken(AnimeModel.name));
  });

  describe('findAnime', () => {
    it('should search by id', async () => {
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({ id: '51478' });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              $and: expect.arrayContaining([
                expect.objectContaining({
                  $or: expect.arrayContaining(
                    Object.values(Provider).map((prov) => ({
                      [`providerIdMapping.${prov}`]: `51478`,
                    })),
                  ),
                }),
              ]),
            }),
          }),
        ]),
      );
    });

    it('should search by title', async () => {
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime(givenTitle);
      expect(spy).toHaveBeenCalledWith(expect.arrayContaining([]));
    });

    it('should search by tag', async () => {
      const givenTag = 'action';
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({ tags: [givenTag] });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              $and: expect.arrayContaining([
                expect.objectContaining({
                  tags: expect.objectContaining({ $all: [givenTag] }),
                }),
              ]),
            }),
          }),
        ]),
      );
    });

    it('should search by multiple tags and title', async () => {
      const givenTags = ['action', 'drama'];
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({
        query: givenTitle,
        tags: givenTags,
      });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $search: {
              index: 'titleSynonymsIndex',
              compound: {
                should: [
                  {
                    text: {
                      query: givenTitle,
                      path: 'title',
                    },
                  },
                  {
                    text: {
                      query: givenTitle,
                      path: 'synonyms',
                    },
                  },
                ],
              },
            },
          }),
        ]),
      );
    });

    it('should search by provider and id', async () => {
      const givenId = '142051';
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({
        id: givenId,
        provider: Provider.Anilist,
      });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              $and: expect.arrayContaining([
                expect.objectContaining({
                  [`providerIdMapping.${Provider.Anilist}`]: `${givenId}`,
                }),
              ]),
            }),
          }),
        ]),
      );
    });

    it('should search by provider and title', async () => {
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({
        query: givenTitle,
        provider: Provider.Anilist,
      });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              $and: expect.arrayContaining([
                expect.objectContaining({
                  [`providerMapping.${Provider.Anilist}`]: {
                    $regex: expect.stringContaining('anilist'),
                    $options: 'i',
                  },
                }),
              ]),
            }),
          }),
        ]),
      );
    });

    it('should accept limit', async () => {
      const spy = jest.spyOn(animeModel, 'aggregate');

      await animeSearchService.findAnime({ query: 'a', limit: 1 });

      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $limit: 1,
          }),
        ]),
      );
    });

    it('should filter out adult anime', async () => {
      const spy = jest.spyOn(animeModel, 'aggregate');
      await animeSearchService.findAnime({ includeAdult: false });
      expect(spy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({
              $and: expect.arrayContaining([
                expect.objectContaining({
                  tags: expect.objectContaining({ $nin: ADULT_TAGS }),
                }),
              ]),
            }),
          }),
        ]),
      );
    });
  });
});
