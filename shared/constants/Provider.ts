export enum Provider {
  Anilist = 'Anilist',
  AniDB = 'AniDB',
  AnimePlanet = 'AnimePlanet',
  AniSearch = 'AniSearch',
  LiveChart = 'LiveChart',
  Kitsu = 'Kitsu',
  MyAnimeList = 'MyAnimeList',
  NotifyMoe = 'NotifyMoe',
}
export const ProviderDomain: {
  [key in Provider]: string;
} = {
  [Provider.Anilist]: 'https://anilist.co',
  [Provider.AniDB]: 'https://anidb.net',
  [Provider.AnimePlanet]: 'https://anime-planet.com',
  [Provider.AniSearch]: 'https://anisearch.com',
  [Provider.LiveChart]: 'https://livechart.me',
  [Provider.Kitsu]: 'https://kitsu.io',
  [Provider.MyAnimeList]: 'https://myanimelist.net',
  [Provider.NotifyMoe]: 'https://notify.moe',
};
