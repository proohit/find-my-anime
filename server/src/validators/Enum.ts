import { PipeTransform } from '@nestjs/common';
import { InvalidEnum } from '../errors/InvalidProvider';
import { MissingQuery } from '../errors/MissingQuery';

export type TransformerOptions = {
  required?: boolean;
};

type EnumTransformerOptions = TransformerOptions & {
  enumType: unknown;
};

export const validateEnumQueryTransformer = (
  options: EnumTransformerOptions,
): PipeTransform<unknown> => ({
  transform: (value, metadata) => {
    const { enumType, required } = options;
    if (!value && required) {
      throw new MissingQuery(metadata.data);
    }
    if (value && !Object.values(enumType).includes(value)) {
      throw new InvalidEnum(enumType);
    }
    return value;
  },
});
