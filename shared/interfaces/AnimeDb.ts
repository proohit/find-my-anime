import { Provider } from '../constants/Provider';

export interface AnimeDB {
  license: License;
  repository: string;
  data: Anime[];
  lastDownloadTime: string;
}

export interface Anime {
  sources: string[];
  title: string;
  type: Type;
  episodes: number;
  status: Status;
  animeSeason: AnimeSeason;
  picture: string;
  thumbnail: string;
  synonyms: string[];
  relations: string[];
  tags: string[];
  description?: string;
  provider?: Provider;
}

export interface AnimeSeason {
  season: Season;
  year?: number;
}

export enum Season {
  Fall = 'FALL',
  Spring = 'SPRING',
  Summer = 'SUMMER',
  Undefined = 'UNDEFINED',
  Winter = 'WINTER',
}

export enum Status {
  Finished = 'FINISHED',
  Ongoing = 'ONGOING',
  Upcoming = 'UPCOMING',
}

export enum Type {
  Movie = 'MOVIE',
  Ona = 'ONA',
  Ova = 'OVA',
  Special = 'SPECIAL',
  Tv = 'TV',
  Unknown = 'UNKNOWN',
}

export interface License {
  name: string;
  url: string;
}
