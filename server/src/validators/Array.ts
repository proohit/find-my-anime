import { PipeTransform } from '@nestjs/common';
import { MissingQuery } from '../errors/MissingQuery';
import { TransformerOptions } from './Enum';

type ArrayTransformerOptions = TransformerOptions & {
  separator?: string;
  trim?: boolean;
};
export const arrayQueryTransformer = (
  options: ArrayTransformerOptions,
): PipeTransform<string, string[]> => ({
  transform: (value, metadata) => {
    const { separator, trim, required } = options;
    if (!value && required) {
      throw new MissingQuery(metadata.data);
    }
    if (value) {
      let values = value.split(separator);
      if (trim) {
        values = values.map((v) => v.trim());
      }
      return values;
    }
  },
});
