export enum Provider {
  Anilist = 'anilist',
  AniDB = 'anidb',
  AnimePlanet = 'anime_planet',
  AniSearch = 'ani_search',
  LiveChart = 'live_chart',
  Kitsu = 'kitsu',
  MyAnimeList = 'my_anime_list',
  NotifyMoe = 'notify_moe',
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
