import { AnimeSeason, Season } from '@find-my-anime/shared/index';
import { animeSeasonQueryTransformer } from './AnimeSeason';

describe('animeSeasonQueryTransformer', () => {
  it('should return parsed object value', () => {
    const transformer = animeSeasonQueryTransformer();
    const givenQuery = `${Season.Fall}-2025`;
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    const expectedValue: AnimeSeason = {
      season: Season.Fall,
      year: 2025,
    };
    expect(result).toEqual(expectedValue);
  });
  it('should return undefined for undefined query', () => {
    const transformer = animeSeasonQueryTransformer();
    const givenQuery = undefined as unknown as string;
    const result = transformer.transform(givenQuery, {
      type: 'query',
      data: 'testQuery',
    });
    expect(result).toBeUndefined();
  });
});
