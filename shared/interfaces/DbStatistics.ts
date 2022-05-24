export type DbStatistics = {
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
};
