import { PipeTransform } from '@nestjs/common';
import { InvalidEnum } from '../errors/InvalidProvider';
import { MissingQuery } from '../errors/MissingQuery';

export type TransformerOptions = {
  required?: boolean;
};

type EnumTransformerOptions<R> = TransformerOptions & {
  enumType: R;
};

export const validateEnumQueryTransformer = <R = unknown>(
  options: EnumTransformerOptions<R>,
): PipeTransform<unknown, R> => ({
  transform: (value, metadata) => {
    const { enumType, required } = options;
    if (!value && required) {
      throw new MissingQuery(metadata.data);
    }
    if (value && !Object.values(enumType).includes(value)) {
      throw new InvalidEnum(enumType);
    }
    return value as R;
  },
});
