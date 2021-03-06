import { Provider, ProviderDomain } from '../constants/Provider';
import { Anime } from '../interfaces/AnimeDb';

export const hasSource = (anime: Anime, provider: Provider): boolean => {
  const sources = anime.sources;
  if (sources) {
    const providerDomain = ProviderDomain[provider];
    const source = sources.find((source) => source.includes(providerDomain));
    return !!source;
  }
  return false;
};

export const getProviders = (anime: Anime): Provider[] => {
  const sources = anime.sources;
  if (sources) {
    const providers: Provider[] = [];
    for (const source of sources) {
      for (const provider of Object.values(Provider)) {
        if (source.includes(ProviderDomain[provider])) {
          providers.push(provider);
        }
      }
    }
    return providers;
  }
  return [];
};

export const getProvider = (anime: Anime, source: string) => {
  const providers = getProviders(anime);
  for (const provider of providers) {
    if (source.includes(ProviderDomain[provider])) {
      return Object.entries(Provider).find(
        ([, value]) => value === provider,
      )?.[0];
    }
  }
  return null;
};

export const getSource = (anime: Anime, provider: Provider): string => {
  const sources = anime.sources;
  if (sources) {
    const providerDomain = ProviderDomain[provider];
    const source = sources.find((source) => source.includes(providerDomain));
    if (source) {
      return source;
    }
  }
  return '';
};
