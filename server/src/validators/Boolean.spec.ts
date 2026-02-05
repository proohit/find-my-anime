import { InvalidQuery } from '../errors/InvalidQuery';
import { MissingQuery } from '../errors/MissingQuery';
import { booleanQueryTransformer } from './Boolean';

describe('booleanQueryTransformer', () => {
  it('should return true from string', () => {
    const transformer = booleanQueryTransformer();
    const givenQuery = 'true';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testField',
    });
    expect(result).toBeTrue();
  });

  it('should return true from string', () => {
    const transformer = booleanQueryTransformer();
    const givenQuery = 'false';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testField',
    });
    expect(result).toBeFalse();
  });

  it('should throw an error if the query is missing but required', () => {
    const transformer = booleanQueryTransformer({ required: true });
    expect(() =>
      transformer.transform(null, {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrow(MissingQuery);
  });

  it('should throw an error if the query is invalid', () => {
    const transformer = booleanQueryTransformer();
    expect(() =>
      transformer.transform('test', {
        type: 'query',
        data: 'testField',
      }),
    ).toThrow(InvalidQuery);
  });

  it('should accept empty values if required option is not set', () => {
    const transformer = booleanQueryTransformer();
    const givenQuery = null;
    expect(() =>
      transformer.transform(givenQuery, {
        type: 'query',
        data: 'testQuery',
      }),
    ).not.toThrow();
  });
});
