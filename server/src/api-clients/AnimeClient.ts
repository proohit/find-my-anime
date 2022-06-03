export interface AnimeClient {
  getAnime(id: string): Promise<EnrichedAnimeAttributes>;
}

interface EnrichedAnimeAttributes {
  description: string;
}
