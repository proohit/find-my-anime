export interface AnimedbResult {
  anime?: AnidbAnime;
  error?: TextElement;
}

export interface TextElement<R = unknown> extends Element<R> {
  _text: string;
}

export interface Element<R> {
  _attributes: R;
}

export interface AnidbAnime
  extends Element<{ id: string; restricted: string }> {
  type: TextElement;
  episodecount: TextElement;
  startdate: Date;
  enddate: Date;
  titles: Titles;
  recommendations: Recommendations;
  url: TextElement;
  creators: Creators;
  description: TextElement;
  ratings?: Ratings;
  picture: TextElement;
  resources: Resources;
  tags: Tags;
  characters: Characters;
  episodes: Episodes;
}

export interface Characters {
  character: Character[];
}

export interface Character
  extends Element<{ id: string; type: string; update: Date }> {
  rating?: CharacterRating;
  name: TextElement;
  gender: TextElement;
  charactertype: Charactertype;
  picture: TextElement;
  seiyuu: Seiyuu;
}

export type Seiyuu = TextElement<{ id: string; picture: string }>;

export type Charactertype = TextElement<{ id: string }>;

export type CharacterRating = TextElement<{ votes: string }>;

export interface Creators {
  name: Name[];
}

export type Name = TextElement<{ id: string; type: string }>;

export interface Episodes {
  episode: Episode;
}

export interface Episode extends Element<{ id: string; update: Date }> {
  epno: Epno;
  length: string;
  airdate: TextElement;
  rating: CharacterRating;
  title: EpisodeTitle;
}

export type Epno = TextElement<{ type: string }>;

export type EpisodeTitle = TextElement<{ 'xml:lang': string }>;

export interface Ratings {
  permanent: Rating;
  temporary: Rating;
}

export type Rating = TextElement<{ count: string }>;

export interface Recommendations extends Element<{ total: string }> {
  recommendation: Recommendation;
}

export type Recommendation = TextElement<{ type: string; uid: string }>;

export interface Resources {
  resource: Resource[];
}

export interface Resource extends Element<{ type: string }> {
  externalentity: Externalentity;
}

export interface Externalentity {
  identifier?: TextElement | TextElement[];
  url?: TextElement;
}

export interface Tags {
  tag: Tag[];
}

export interface Tag
  extends Element<{
    id: string;
    weight: string;
    localspoiler: string;
    globalspoiler: string;
    verified: string;
    update: Date;
    parentid?: string;
    infobox?: string;
  }> {
  name: TextElement;
  description?: TextElement;
  picurl?: TextElement;
}

export interface Titles {
  title: TitleElement[];
}

export type TitleElement = TextElement<{ 'xml:lang': string; type: string }>;
