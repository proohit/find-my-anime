import { PipeTransform } from '@nestjs/common';
import { InvalidQuery } from '../errors/InvalidQuery';
import { MissingQuery } from '../errors/MissingQuery';
import { TransformerOptions } from './Enum';

type BooleanTransformerOptions = TransformerOptions;

export const booleanQueryTransformer = (
  options?: BooleanTransformerOptions,
): PipeTransform<string, boolean> => ({
  transform: (value, metadata) => {
    if (!value && options?.required) {
      throw new MissingQuery(metadata.data);
    }
    if (value) {
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      throw new InvalidQuery(`${metadata.data} must be true or false`);
    }
  },
});
