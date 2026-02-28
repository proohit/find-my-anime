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
            find: () => ({
              limit: () => ({
                transform: () => ({
                  lean: () => ({
                    exec: () => Promise.resolve(mockAnimeData),
                  }),
                }),
              }),
            }),
          },
        },
      ],
    }).compile();
    animeSearchService = module.get(AnimeSearchService);
    animeModel = module.get(getModelToken(AnimeModel.name));
  });

  describe('findAnime', () => {
    it('should search by id', async () => {
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(undefined, '51478');
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              sources: expect.objectContaining({ $regex: '51478$' }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should search by title', async () => {
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(givenTitle);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $text: { $search: givenTitle },
        }),
        expect.anything(),
      );
    });

    it('should search by tag', async () => {
      const givenTag = 'action';
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(undefined, undefined, undefined, [
        givenTag,
      ]);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              tags: expect.objectContaining({ $all: [givenTag] }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should search by multiple tags and title', async () => {
      const givenTags = ['action', 'drama'];
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(
        givenTitle,
        undefined,
        undefined,
        givenTags,
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $text: { $search: givenTitle },
          $and: expect.arrayContaining([
            expect.objectContaining({
              tags: expect.objectContaining({ $all: givenTags }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should search by provider and id', async () => {
      const givenId = '142051';
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(undefined, givenId, Provider.Anilist);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              sources: expect.objectContaining({
                $regex: `^https://anilist\\.co.*${givenId}$`,
              }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should search by provider and title', async () => {
      const givenTitle = 'sword art online';
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(
        givenTitle,
        undefined,
        Provider.Anilist,
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $text: { $search: givenTitle },
          $and: expect.arrayContaining([
            expect.objectContaining({
              sources: expect.objectContaining({
                $regex: `^https://anilist\\.co`,
              }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should accept limit', async () => {
      const limitFn = jest.fn((limit: number) => ({
        transform: () => ({
          lean: () => ({
            exec: () => Promise.resolve(mockAnimeData.slice(0, limit)),
          }),
        }),
      }));
      jest.spyOn(animeModel, 'find').mockReturnValue({ limit: limitFn } as any);

      await animeSearchService.findAnime(
        'a',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
      );

      expect(limitFn).toHaveBeenCalledWith(1);
    });

    it('should filter out adult anime', async () => {
      const spy = jest.spyOn(animeModel, 'find');
      await animeSearchService.findAnime(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              tags: expect.objectContaining({ $nin: ADULT_TAGS }),
            }),
          ]),
        }),
        expect.anything(),
      );
    });
  });
});
