export interface AnimeClient {
  getAnime(
    id: string,
    externalFields?: string[],
  ): Promise<EnrichedAnimeAttributes>;
}

export interface EnrichedAnimeAttributes {
  description: string;
}
