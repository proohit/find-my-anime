import { Provider } from '@find-my-anime/shared/constants/Provider';
import { InvalidEnum } from '../errors/InvalidProvider';
import { MissingQuery } from '../errors/MissingQuery';
import { validateEnumQueryTransformer } from './Enum';

describe('enumQueryTransformer', () => {
  it('should return an enum from a string', () => {
    const transformer = validateEnumQueryTransformer({
      enumType: Provider,
    });
    const givenQuery = 'Anilist';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toEqual(Provider.Anilist);
  });
  it('should throw an error if the query is missing but required', () => {
    const transformer = validateEnumQueryTransformer({
      enumType: Provider,
      required: true,
    });
    expect(() =>
      transformer.transform(null, {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(MissingQuery);
  });

  it('should throw an error if the query is invalid', () => {
    const transformer = validateEnumQueryTransformer({
      enumType: Provider,
    });
    expect(() =>
      transformer.transform('invalid enum', {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(InvalidEnum);
  });

  it('should accept empty values if required option is not set', () => {
    const transformer = validateEnumQueryTransformer({
      enumType: Provider,
    });
    const givenQuery = null;
    expect(() =>
      transformer.transform(givenQuery, {
        type: 'query',
        data: 'testQuery',
      }),
    ).not.toThrow();
  });
});
