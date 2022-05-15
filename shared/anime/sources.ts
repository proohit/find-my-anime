import { Provider, ProviderDomain } from '@shared/constants/Provider';
import { Anime } from '@shared/interfaces/AnimeDb';

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

export const getProviderId = (
  anime: Anime,
  provider: Provider,
): string | undefined => {
  const source = getSource(anime, provider);
  if (source) {
    return source.split('/').pop();
  }
};
