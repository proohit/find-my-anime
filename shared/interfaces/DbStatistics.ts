import { Telemetry } from './AnimeDb';

export type DbStatistics = {
  lastDownloaded: string;
  anime: {
    count: number;
    seasons: {
      [anime: string]: number;
    };
  };
  tags: {
    count: number;
    mostUsedTags: { [tag: string]: number };
  };
  telemetry: Telemetry;
};
