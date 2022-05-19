import { InvalidQuery } from '../errors/InvalidQuery';
import { MissingQuery } from '../errors/MissingQuery';
import { stringQueryTransformer } from './String';

describe('stringQueryTransformer', () => {
  it('should return a string from a string', () => {
    const transformer = stringQueryTransformer();
    const givenQuery = 'test';
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toEqual('test');
  });
  it('should throw an error if the query is missing but required', () => {
    const transformer = stringQueryTransformer({ required: true });
    expect(() =>
      transformer.transform(null, {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(MissingQuery);
  });
  it('should accept empty values if required option is not set', () => {
    const transformer = stringQueryTransformer();
    const givenQuery = null;
    expect(() =>
      transformer.transform(givenQuery, {
        type: 'query',
        data: 'testQuery',
      }),
    ).not.toThrow();
  });

  it('should throw an error if the query is shorter than minLength', () => {
    const transformer = stringQueryTransformer({ minLength: 5 });
    expect(() =>
      transformer.transform('test', {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(InvalidQuery);
  });

  it('should throw an error if the query is longer than maxLength', () => {
    const transformer = stringQueryTransformer({ maxLength: 5 });
    expect(() =>
      transformer.transform('testtest', {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(InvalidQuery);
  });

  it('should throw an error if the query contains spaces but is configured not to', () => {
    const transformer = stringQueryTransformer({ forbidSpace: true });
    expect(() =>
      transformer.transform('test test', {
        type: 'query',
        data: 'testQuery',
      }),
    ).toThrowError(InvalidQuery);
  });
});
