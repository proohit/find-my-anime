import { PipeTransform } from '@nestjs/common';
import { InvalidQuery } from '../errors/InvalidQuery';
import { MissingQuery } from '../errors/MissingQuery';
import { TransformerOptions } from './Enum';

type StringTransformerOptions = TransformerOptions & {
  forbidSpace?: boolean;
  minLength?: number;
  maxLength?: number;
};
export const stringQueryTransformer = (
  options?: StringTransformerOptions,
): PipeTransform<string, string> => ({
  transform: (value, metadata) => {
    if (!value && options?.required) {
      throw new MissingQuery(metadata.data);
    }
    if (value) {
      if (options?.minLength && value.length < options.minLength) {
        throw new InvalidQuery(
          `${metadata.data} must be at least ${options.minLength} characters long`,
        );
      }
      if (options?.maxLength && value.length > options.maxLength) {
        throw new InvalidQuery(
          `${metadata.data} must be at most ${options.maxLength} characters long`,
        );
      }
      if (options?.forbidSpace && value.includes(' ')) {
        throw new InvalidQuery(`${metadata.data} must not contain spaces`);
      }
    }
    return value;
  },
});
