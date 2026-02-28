import { Provider } from '../constants/Provider';
import { Anime } from '../interfaces/AnimeDb';
import { getSource, hasSource } from './sources';

export const getAnyIdOfAnime = (anime: Anime) => {
  const sources = [...anime.sources];
  if (sources.length <= 0) {
    throw new Error('Anime has no id');
  }
  return sources[0].split('/').pop();
};

export const getProviderIdOfAnime = (
  anime: Anime,
  provider: Provider,
): string => {
  if (!hasSource(anime, provider)) {
    throw new Error('Anime has no id for provider');
  }
  const source = getSource(anime, provider);
  return source.split('/').pop() || '';
};
