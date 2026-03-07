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

export const getProviderIdMappings = (
  anime: Anime,
): Record<Provider, string> => {
  const sources = anime.sources;
  const providerIdMapping: Record<string, string> = {};
  if (sources) {
    for (const source of sources) {
      for (const provider of Object.values(Provider)) {
        if (source.includes(ProviderDomain[provider])) {
          const id = source.split('/').pop() || '';
          providerIdMapping[provider] = id;
        }
      }
    }
  }
  return providerIdMapping;
};

export const getProviderSourceMappings = (
  anime: Anime,
): Record<Provider, string> => {
  const mapping: Record<string, string> = {};
  const providers = getProviders(anime);
  providers.forEach((provider) => {
    const source = getSource(anime, provider);
    if (source) {
      mapping[provider] = source;
    }
  });
  return mapping;
};
