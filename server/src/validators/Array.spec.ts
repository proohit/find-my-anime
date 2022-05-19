import { MissingQuery } from '../errors/MissingQuery';
import { arrayQueryTransformer } from './Array';

describe('arrayQueryTransformer', () => {
  it('should return an array from a string with default separator', () => {
    const transformer = arrayQueryTransformer();
    const givenQuery = '1,2,3';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toEqual(['1', '2', '3']);
  });
  it("should trim values if 'trim' option is true", () => {
    const transformer = arrayQueryTransformer({ trim: true });
    const givenQuery = '1, 2, 3';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toEqual(['1', '2', '3']);
  });
  it('should throw an error if the query is missing but required', () => {
    const transformer = arrayQueryTransformer({ required: true });
    expect(() =>
      transformer.transform(null, {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(MissingQuery);
  });
  it('should return an array from a string with custom separator', () => {
    const transformer = arrayQueryTransformer({ separator: '|' });
    const givenQuery = '1|2|3';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toEqual(['1', '2', '3']);
  });
  it('should accept empty values if required option is not set', () => {
    const transformer = arrayQueryTransformer();
    const givenQuery = null;
    expect(() =>
      transformer.transform(givenQuery, {
        type: 'query',
        data: 'testQuery',
      }),
    ).not.toThrow();
  });
});
