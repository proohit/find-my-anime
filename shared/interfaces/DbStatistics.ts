export type DbStatistics = {
  anime: {
    count: number;
  };
  tags: {
    count: number;
    mostUsedTags: { [tag: string]: number };
  };
};
