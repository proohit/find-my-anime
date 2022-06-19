import { Anime } from '../interfaces/AnimeDb';

export const ADULT_TAGS = [
  'hentai',
  'anal',
  'defloration',
  'flat chested',
  'oral',
  'big boobs',
  'hardcore',
  'masturbation',
  'sado maso',
  'tentacle',
  'threesome',
  'tribadism',
  'softcore',
  'smut',
  'boobjob',
  'dark skinned girl',
  'group sex',
  'lactation',
  'older woman, younger man',
  'older man, younger woman',
  'exhibitionism',
  'incest',
  'urinating',
  'voyeurism',
  'strap-ons',
  'double penetration',
  'housewife',
  'enema',
  'miko',
  'footjob',
  'trainer',
  'cross dressing',
  'dominatrix',
  'chikan',
  'futanari',
];

export const isAdult = (anime: Anime) => {
  return anime.tags.some((tag) => ADULT_TAGS.includes(tag));
};
