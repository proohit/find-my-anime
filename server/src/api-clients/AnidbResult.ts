export interface AnimedbResult {
  anime?: AnidbAnime;
  error?: string;
}

export interface AnidbAnime {
  type: string;
  episodecount: string;
  startdate: Date;
  enddate: Date;
  titles: Titles;
  recommendations: Recommendations;
  url: string;
  creators: Creators;
  description: string;
  ratings: Ratings;
  picture: string;
  resources: Resources;
  tags: Tags;
  characters: Characters;
  episodes: Episodes;
  _id: string;
  _restricted: string;
}

export interface Description {
  _text: string;
}

export interface Characters {
  character: Character[];
}

export interface Character {
  rating?: Rating;
  name: string;
  gender: string;
  charactertype: Charactertype;
  picture: string;
  seiyuu: Seiyuu;
  _id: string;
  _type: string;
  _update: Date;
}

export interface Charactertype {
  _id: string;
  __text: string;
}

export interface Rating {
  _votes: string;
  __text: string;
}

export interface Seiyuu {
  _id: string;
  _picture: string;
  __text: string;
}

export interface Creators {
  name: Name[];
}

export interface Name {
  _id: string;
  _type: string;
  __text: string;
}

export interface Episodes {
  episode: Episode;
}

export interface Episode {
  epno: Epno;
  length: string;
  airdate: Date;
  rating: Rating;
  title: EpisodeTitle;
  _id: string;
  _update: Date;
}

export interface Epno {
  _type: string;
  __text: string;
}

export interface EpisodeTitle {
  '_xml:lang': string;
  __text: string;
}

export interface Ratings {
  permanent: Permanent;
  temporary: Permanent;
}

export interface Permanent {
  _count: string;
  __text: string;
}

export interface Recommendations {
  recommendation: Recommendation;
  _total: string;
}

export interface Recommendation {
  _type: string;
  _uid: string;
  __text: string;
}

export interface Resources {
  resource: Resource[];
}

export interface Resource {
  externalentity: Externalentity;
  _type: string;
}

export interface Externalentity {
  identifier?: string[] | string;
  url?: string;
}

export interface Tags {
  tag: Tag[];
}

export interface Tag {
  name: string;
  description?: string;
  _id: string;
  _weight: string;
  _localspoiler: string;
  _globalspoiler: string;
  _verified: string;
  _update: Date;
  picurl?: string;
  _parentid?: string;
  _infobox?: string;
}

export interface Titles {
  title: TitleElement[];
}

export interface TitleElement {
  '_xml:lang': string;
  _type: string;
  __text: string;
}
