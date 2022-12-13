import { Provider } from '../constants/Provider';
import { Season } from '../constants/Season';
import { Status } from '../constants/Status';
import { Type } from '../constants/Type';

export enum TelemetrySource {
  App = 'app',
  External = 'external',
  Anonymous = 'anonymous',
}

export type TelemetryEntry = {
  data: string;
  count?: number;
  source?: TelemetrySource;
};

export type Telemetry = TelemetryEntry[];
export interface AnimeDB {
  license: License;
  repository: string;
  data: Anime[];
  lastDownloadTime: string;
  telemetry: Telemetry;
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
  providerMapping?: {
    [key in Provider]?: string;
  };
}

export interface AnimeSeason {
  season: Season;
  year?: number;
}

export interface License {
  name: string;
  url: string;
}
