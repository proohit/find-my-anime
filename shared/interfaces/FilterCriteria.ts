import { Provider } from '../constants/Provider';
import { AnimeSeason } from './AnimeDb';

export interface FilterCriteria {
    query?: string;
    id?: string;
    provider?: Provider;
    tags?: string[];
    excludedTags?: string[];
    includeAdult?: boolean;
    season?: AnimeSeason;
}

export type LimitedFilterCriteria = FilterCriteria & { limit: number };
export type MaybeLimitedFilterCriteria = FilterCriteria & { limit?: number };
