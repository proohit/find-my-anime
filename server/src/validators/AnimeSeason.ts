import { PipeTransform } from '@nestjs/common';
import { MissingQuery } from '../errors/MissingQuery';
import { TransformerOptions } from './Enum';
import { type AnimeSeason } from '@find-my-anime/shared/interfaces/AnimeDb';
import { Season } from '@find-my-anime/shared/constants/Season';
import { InvalidQuery } from '../errors/InvalidQuery';

type AnimeSeasonTransformerOptions = TransformerOptions;
export const animeSeasonQueryTransformer = (
  options?: AnimeSeasonTransformerOptions,
): PipeTransform<string | undefined, AnimeSeason | undefined> => ({
  transform: (value, metadata) => {
    if (!value && options?.required) {
      throw new MissingQuery(metadata.data);
    }

    if (!value) {
      return undefined;
    }

    const values: string[] = value.split('-');
    if (!values.length || values.length < 2) {
      throw new InvalidQuery(metadata.data as string);
    }
    const season = values[0] as Season;
    if (!Object.values(Season).includes(season)) {
      throw new InvalidQuery(metadata.data as string);
    }
    const year = values[1];
    const yearNumber = parseInt(year);
    if (isNaN(yearNumber)) {
      throw new InvalidQuery(metadata.data as string);
    }
    return { season, year: yearNumber };
  },
});
