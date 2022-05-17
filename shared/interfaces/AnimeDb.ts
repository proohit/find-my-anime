import { Provider } from '../constants/Provider';
import { Season } from '../constants/Season';
import { Status } from '../constants/Status';
import { Type } from '../constants/Type';

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

export interface License {
  name: string;
  url: string;
}
