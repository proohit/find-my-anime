import { Provider } from '@find-my-anime/shared/constants/Provider';
import { Season } from '@find-my-anime/shared/constants/Season';
import { Status } from '@find-my-anime/shared/constants/Status';
import { Type } from '@find-my-anime/shared/constants/Type';
import { Anime, AnimeDB } from '@find-my-anime/shared/interfaces/AnimeDb';
import { DbStatistics } from '@find-my-anime/shared/interfaces/DbStatistics';

export const emptyAnime: Anime = {
  animeSeason: {
    season: Season.Undefined,
    year: NaN,
  },
  episodes: NaN,
  picture: '',
  title: '',
  type: Type.Unknown,
  relations: [],
  tags: [],
  sources: [],
  status: Status.Finished,
  synonyms: [],
  thumbnail: '',
  description: undefined,
  provider: Provider.AniDB,
};

export const emptyMockStats: DbStatistics = {
  lastDownloaded: '',
  anime: {
    count: 0,
    seasons: {},
  },
  tags: {
    count: 0,
    mostUsedTags: {},
  },
};

export const mockAnimeDb: AnimeDB = {
  lastDownloadTime: '',
  license: {
    name: '',
    url: '',
  },
  repository: '',
  data: [
    {
      sources: [
        'https://anilist.co/anime/142051',
        'https://myanimelist.net/anime/51478',
      ],
      title: '!NVADE SHOW!',
      type: Type.Special,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Fall,
        year: 2020,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/1930/122178.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/1930/122178t.jpg',
      synonyms: ['!nvade Show!'],
      relations: [
        'https://anilist.co/anime/101633',
        'https://myanimelist.net/anime/37869',
      ],
      tags: ['band', 'full cgi', 'music'],
    },
    {
      sources: [
        'https://anidb.net/anime/142051',
        'https://anilist.co/anime/102416',
        'https://anime-planet.com/anime/chiaki-kuriyama-0',
        'https://kitsu.io/anime/8925',
        'https://myanimelist.net/anime/20707',
        'https://notify.moe/anime/Ff1bpKmmR',
      ],
      title: '"0"',
      type: Type.Special,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Summer,
        year: 2013,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/12/81160.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/12/81160t.jpg',
      synonyms: [
        '"Zero"',
        'Chiaki Kuriyama - 0',
        'Chiaki Kuriyama - Zero',
        'Chiaki Kuriyama: "0"',
        'Chiaki Kuriyama: 「0」',
        '「0」',
        '栗山 千明「0」',
      ],
      relations: [],
      tags: ['female protagonist', 'music'],
    },
    {
      sources: [
        'https://anidb.net/anime/3689',
        'https://anisearch.com/anime/1789',
        'https://kitsu.io/anime/9179',
        'https://myanimelist.net/anime/25627',
        'https://notify.moe/anime/eM1-pKmiR',
      ],
      title: '"Aesop" no Ohanashi yori: Ushi to Kaeru, Yokubatta Inu',
      type: Type.Movie,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Winter,
        year: 1970,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/3/65151.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/3/65151t.jpg',
      synonyms: [
        '"いそっぷ"のおはなしより 牛とかえる',
        '"いそっぷ"のおはなしより 牛とかえる, よくばった犬',
        "From Aesop's Tales: The Bull and the Frog / The Greedy Dog",
        'From Aesop`s Tales: The Bull and the Frog / The Greedy Dog',
        '“いそっぷ”のおはなしより 牛とかえる、よくばった犬',
      ],
      relations: [],
      tags: ['fantasy', 'kids'],
    },
    {
      sources: [
        'https://anidb.net/anime/7294',
        'https://anilist.co/anime/7669',
        'https://anime-planet.com/anime/bungaku-shoujo-kyou-no-oyatsu-hatsukoi',
        'https://anisearch.com/anime/5970',
        'https://kitsu.io/anime/5078',
        'https://livechart.me/anime/5549',
        'https://myanimelist.net/anime/7669',
        'https://notify.moe/anime/oTdkpKiig',
      ],
      title: '"Bungaku Shoujo" Kyou no Oyatsu: Hatsukoi',
      type: Type.Ova,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Fall,
        year: 2009,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/2/79900.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/2/79900t.jpg',
      synonyms: [
        '"文学少女"今日のおやつ ~はつ恋~',
        'Book Girl OVA',
        'Bungaku Shoujo OVA',
        'Bungaku Shoujo: Kyou no Oyatsu - Hatsukoi',
        'Bungaku Shōjo: Kyō no Oyatsu - Hatsukoi',
        'Literature Girl',
        'Literature Girl OVA',
        'Literature Girl: Today`s Snack - First Love',
        'Буквоежка: Первая любовь',
        '“文学少女”今日のおやつ 〜はつ恋〜',
        '“文学少女”今日のおやつ ～はつ恋～',
        '文学少女 今日のおやつ 〜はつ恋〜',
      ],
      relations: [
        'https://anidb.net/anime/6959',
        'https://anidb.net/anime/7441',
        'https://anilist.co/anime/6408',
        'https://anime-planet.com/anime/bungaku-shoujo-memoire',
        'https://anime-planet.com/anime/bungaku-shoujo-movie',
        'https://kitsu.io/anime/4550',
        'https://myanimelist.net/anime/6408',
        'https://notify.moe/anime/UUie5KimR',
      ],
      tags: ['comedy', 'drama', 'fantasy', 'romance', 'school'],
    },
    {
      sources: [
        'https://anidb.net/anime/7294',
        'https://anilist.co/anime/7669',
        'https://anime-planet.com/anime/bungaku-shoujo-kyou-no-oyatsu-hatsukoi',
        'https://anisearch.com/anime/5970',
        'https://kitsu.io/anime/5078',
        'https://livechart.me/anime/5549',
        'https://myanimelist.net/anime/7669',
        'https://notify.moe/anime/oTdkpKiig',
      ],
      title: '"Bungaku Shoujo" Kyou no Oyatsu: Hatsukoi',
      type: Type.Ova,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Fall,
        year: 2009,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/2/79900.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/2/79900t.jpg',
      synonyms: [
        '"文学少女"今日のおやつ ~はつ恋~',
        'Book Girl OVA',
        'Bungaku Shoujo OVA',
        'Bungaku Shoujo: Kyou no Oyatsu - Hatsukoi',
        'Bungaku Shōjo: Kyō no Oyatsu - Hatsukoi',
        'Literature Girl',
        'Literature Girl OVA',
        'Literature Girl: Today`s Snack - First Love',
        'Буквоежка: Первая любовь',
        '“文学少女”今日のおやつ 〜はつ恋〜',
        '“文学少女”今日のおやつ ～はつ恋～',
        '文学少女 今日のおやつ 〜はつ恋〜',
      ],
      relations: [
        'https://anidb.net/anime/6959',
        'https://anidb.net/anime/7441',
        'https://anilist.co/anime/6408',
        'https://anime-planet.com/anime/bungaku-shoujo-memoire',
        'https://anime-planet.com/anime/bungaku-shoujo-movie',
        'https://kitsu.io/anime/4550',
        'https://myanimelist.net/anime/6408',
        'https://notify.moe/anime/UUie5KimR',
      ],
      tags: [
        'asia',
        'based on a light novel',
        'comedy',
        'drama',
        'earth',
        'fantasy',
        'japan',
        'library',
        'novel',
        'present',
        'psychological drama',
        'romance',
        'school',
        'school club',
        'school clubs',
        'school life',
        'short movie',
        'shoujo',
        'slice of life',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/7441',
        'https://anilist.co/anime/8481',
        'https://anime-planet.com/anime/bungaku-shoujo-memoire',
        'https://anisearch.com/anime/6169',
        'https://kitsu.io/anime/5352',
        'https://livechart.me/anime/5640',
        'https://myanimelist.net/anime/8481',
        'https://notify.moe/anime/UBTmtKiiR',
      ],
      title: '"Bungaku Shoujo" Memoire',
      type: Type.Ova,
      episodes: 3,
      status: Status.Finished,
      animeSeason: {
        season: Season.Spring,
        year: 2010,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/6/26770.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/6/26770t.jpg',
      synonyms: [
        '"文学少女" メモワール',
        'Book Girl Memories',
        'Book Girl: Memoire',
        'Bungaku Shoujo Memoire I Yume-Miru Shoujo no Prelude',
        'Bungaku Shoujo: Memoire',
        'Bungaku Shoujo: Mémoire',
        'Bungaku Shōjo: Memoire',
        'II Sora-Mau Tenshi no Requiem',
        'III Koi Suru Otome no Rhapsody',
        'Knihomolka',
        'Literature Girl: Memoire',
        'Буквоежка: Воспоминания',
        'Записки літературної панянки',
        '“文学少女” メモワール',
        '“文学少女”メモワール',
        'ぶんがくしょうじょめもわーる',
        '文学少女 メモワール',
      ],
      relations: [
        'https://anidb.net/anime/6959',
        'https://anidb.net/anime/7294',
        'https://anilist.co/anime/6408',
        'https://anime-planet.com/anime/bungaku-shoujo-kyou-no-oyatsu-hatsukoi',
        'https://anime-planet.com/anime/bungaku-shoujo-movie',
        'https://kitsu.io/anime/4550',
        'https://myanimelist.net/anime/6408',
        'https://notify.moe/anime/UUie5KimR',
      ],
      tags: [
        'angst',
        'asia',
        'based on a light novel',
        'classic literature',
        'comedy',
        'coming of age',
        'contemporary fantasy',
        'drama',
        'earth',
        'ensemble cast',
        'episodic',
        'female protagonist',
        'japan',
        'mystery',
        'novel',
        'present',
        'primarily female cast',
        'psychological',
        'romance',
        'school',
        'school life',
        'shoujo',
        'slice of life',
        'slice of life drama',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/6959',
        'https://anilist.co/anime/6408',
        'https://anime-planet.com/anime/bungaku-shoujo-movie',
        'https://anisearch.com/anime/5387',
        'https://kitsu.io/anime/4550',
        'https://livechart.me/anime/4198',
        'https://myanimelist.net/anime/6408',
        'https://notify.moe/anime/UUie5KimR',
      ],
      title: '"Bungaku Shoujo" Movie',
      type: Type.Movie,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Spring,
        year: 2010,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/8/81162.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/8/81162t.jpg',
      synonyms: [
        'A Literary Girl',
        'Book Girl',
        'Book Girl, La Chica que Devoraba Libros',
        'Book Girl: La chica de los libros',
        'Bungaku Shoujo',
        'Bungaku Shoujo - O Filme',
        'Bungaku Shōjo',
        'Garota dos Livros: O Filme',
        'Gekijouban Bungaku Shoujo',
        'Gekijōban Bungaku Shōjo',
        'Literature Girl',
        'Буквоежка',
        'げきじょうばんぶんがくしょうじょ',
        '劇場版 文学少女',
        '劇場版"文学少女"',
        '劇場版“文学少女”',
        '文学少女',
      ],
      relations: [
        'https://anidb.net/anime/7294',
        'https://anidb.net/anime/7441',
        'https://anilist.co/anime/7669',
        'https://anilist.co/anime/8481',
        'https://anime-planet.com/anime/bungaku-shoujo-kyou-no-oyatsu-hatsukoi',
        'https://anime-planet.com/anime/bungaku-shoujo-memoire',
        'https://kitsu.io/anime/5078',
        'https://kitsu.io/anime/5352',
        'https://myanimelist.net/anime/7669',
        'https://myanimelist.net/anime/8481',
        'https://notify.moe/anime/UBTmtKiiR',
        'https://notify.moe/anime/oTdkpKiig',
      ],
      tags: [
        'asia',
        'based on a light novel',
        'classic literature',
        'comedy',
        'coming of age',
        'drama',
        'earth',
        'japan',
        'love polygon',
        'love triangle',
        'male protagonist',
        'mystery',
        'novel',
        'present',
        'psychological',
        'psychological drama',
        'romance',
        'school',
        'school club',
        'school life',
        'supernatural drama',
        'time skip',
        'tragedy',
        'yandere',
      ],
    },
    {
      sources: [
        'https://anilist.co/anime/138257',
        'https://anime-planet.com/anime/calpis-hakkou-monogatari',
        'https://kitsu.io/anime/41893',
        'https://myanimelist.net/anime/38045',
        'https://notify.moe/anime/NeI-pv0iR',
      ],
      title: '"Calpis" Hakkou Monogatari',
      type: Type.Ona,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Spring,
        year: 2018,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/1168/93236.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/1168/93236t.jpg',
      synonyms: [
        '"Calpis" Fermentation Story',
        'Calpis: Hakkou Monogatari',
        '「カルピス」発酵ものがたり',
      ],
      relations: [],
      tags: ['advertisement', 'food and beverage', 'historical', 'promotional'],
    },
    {
      sources: [
        'https://anidb.net/anime/4317',
        'https://anilist.co/anime/6076',
        'https://anime-planet.com/anime/eiji',
        'https://anisearch.com/anime/6068',
        'https://kitsu.io/anime/4416',
        'https://myanimelist.net/anime/6076',
        'https://notify.moe/anime/lcAq5Fmig',
      ],
      title: '"Eiji"',
      type: Type.Movie,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Summer,
        year: 1990,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/7/38319.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/7/38319t.jpg',
      synonyms: ['Eiji', '「エイジ」', 'エイジ'],
      relations: [],
      tags: [
        'based on a manga',
        'boxing',
        'combat sports',
        'comedy',
        'drama',
        'hand to hand combat',
        'manga',
        'present',
        'shounen',
        'sports',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/12936',
        'https://anime-planet.com/anime/eikou-naki-tensai-tachi-kara-no-monogatari',
        'https://anisearch.com/anime/12361',
        'https://kitsu.io/anime/40654',
        'https://livechart.me/anime/2696',
        'https://myanimelist.net/anime/35025',
        'https://notify.moe/anime/tZ-DhFmmR',
      ],
      title: '"Eikou Naki Tensai-tachi" Kara no Monogatari',
      type: Type.Special,
      episodes: 2,
      status: Status.Finished,
      animeSeason: {
        season: Season.Winter,
        year: 2017,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/4/84552.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/4/84552t.jpg',
      synonyms: [
        '"Eikou Naki Tensai-tachi" kara no Monogatari',
        '"栄光なき天才たち"からの物語',
        'Stories From "Geniuses Without Glory"',
        '“Eikou Naki Tensai-tachi” kara no Monogatari',
        '“Eikō Naki Tensai-tachi” kara no Monogatari',
        '“栄光なき天才たち”からの物語',
      ],
      relations: [],
      tags: [
        'based on a manga',
        'manga',
        'present',
        'running',
        'seinen',
        'sports',
        'swimming',
        'track and field',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/12142',
        'https://anilist.co/anime/21829',
        'https://anime-planet.com/anime/eiyuu-kaitai',
        'https://anisearch.com/anime/11499',
        'https://kitsu.io/anime/12654',
        'https://livechart.me/anime/2200',
        'https://myanimelist.net/anime/33363',
        'https://notify.moe/anime/cLhmhFiiR',
      ],
      title: '"Eiyuu" Kaitai',
      type: Type.Ova,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Fall,
        year: 2016,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/1192/112238.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/1192/112238t.jpg',
      synonyms: [
        '"Eiyū" Kaitai',
        '"Heroes" Dismissed',
        'Eiyu Kaitai',
        'Heroes Retirement',
        'Herors Retirement',
        '「英雄」解体',
      ],
      relations: [],
      tags: [
        'based on a light novel',
        'comedy',
        'drama',
        'fantasy',
        'isekai',
        'novel',
        'ojou-sama',
        'person in a strange world',
        'primarily adult cast',
        'rehabilitation',
        'reverse isekai',
        'rpg',
        'seinen',
        'siblings',
        'slice of life',
        'superpower',
      ],
    },
    {
      sources: ['https://anilist.co/anime/146608'],
      title: '(Title to be Announced)',
      type: Type.Movie,
      episodes: 1,
      status: Status.Upcoming,
      animeSeason: {
        season: Season.Undefined,
      },
      picture:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146608-S048pXNP6f4H.jpg',
      thumbnail:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146608-S048pXNP6f4H.jpg',
      synonyms: [],
      relations: [],
      tags: [],
    },
    {
      sources: ['https://anilist.co/anime/148080'],
      title: '(Title to be Announced)',
      type: Type.Ona,
      episodes: 1,
      status: Status.Upcoming,
      animeSeason: {
        season: Season.Undefined,
        year: 2024,
      },
      picture:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148080-Vh4JomDG4dfW.jpg',
      thumbnail:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148080-Vh4JomDG4dfW.jpg',
      synonyms: [],
      relations: [],
      tags: [],
    },
    {
      sources: ['https://anilist.co/anime/142278'],
      title: '(Title to be Announced)',
      type: Type.Unknown,
      episodes: 0,
      status: Status.Upcoming,
      animeSeason: {
        season: Season.Undefined,
      },
      picture:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b142278-kixcIocQg2Wf.png',
      thumbnail:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b142278-kixcIocQg2Wf.png',
      synonyms: ['Love Cobra'],
      relations: [],
      tags: [],
    },
    {
      sources: [
        'https://anisearch.com/anime/14740',
        'https://myanimelist.net/anime/40658',
      ],
      title: '** Kouhai',
      type: Type.Ova,
      episodes: 6,
      status: Status.Ongoing,
      animeSeason: {
        season: Season.Winter,
        year: 2020,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/1839/104009.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/1839/104009t.jpg',
      synonyms: ['** Kōhai', 'Assisted Mating', 'Enjo Kouhai', '○○交配'],
      relations: [],
      tags: [
        'alternative world',
        'anal',
        'defloration',
        'demons',
        'elves',
        'fantasy',
        'flat chested',
        'harem',
        'hentai',
        'magical girl',
        'mythology',
        'oral',
        'present',
        'school',
        'school girl',
      ],
    },
    {
      sources: ['https://anime-planet.com/anime/luna-classroom'],
      title: '*Luna: classroom',
      type: Type.Special,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Undefined,
        year: 2017,
      },
      picture:
        'https://cdn.anime-planet.com/anime/primary/luna-classroom-1.jpg?t=1625898816',
      thumbnail:
        'https://cdn.anime-planet.com/anime/primary/luna-classroom-1-190x266.jpg?t=1625898816',
      synonyms: [],
      relations: [],
      tags: ['vocaloid'],
    },
    {
      sources: ['https://anime-planet.com/anime/luna-main-character'],
      title: '*Luna: Main Character',
      type: Type.Special,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Undefined,
        year: 2016,
      },
      picture:
        'https://cdn.anime-planet.com/anime/primary/luna-main-character-1.jpg?t=1625908117',
      thumbnail:
        'https://cdn.anime-planet.com/anime/primary/luna-main-character-1-190x266.jpg?t=1625908117',
      synonyms: [],
      relations: [],
      tags: ['vocaloid'],
    },
    {
      sources: ['https://livechart.me/anime/10701'],
      title: '.',
      type: Type.Unknown,
      episodes: 0,
      status: Status.Upcoming,
      animeSeason: {
        season: Season.Undefined,
      },
      picture: 'https://cdn.myanimelist.net/images/qm_50.gif',
      thumbnail: 'https://cdn.myanimelist.net/images/qm_50.gif',
      synonyms: [],
      relations: [],
      tags: [],
    },
    {
      sources: [
        'https://anidb.net/anime/5391',
        'https://anilist.co/anime/2928',
        'https://anime-planet.com/anime/hack-g-u-returner',
        'https://anisearch.com/anime/4410',
        'https://kitsu.io/anime/2652',
        'https://livechart.me/anime/4717',
        'https://myanimelist.net/anime/2928',
        'https://notify.moe/anime/NCh85FiiR',
      ],
      title: '.hack//G.U. Returner',
      type: Type.Ova,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Winter,
        year: 2007,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/1798/115989.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/1798/115989t.jpg',
      synonyms: [
        '.HACK//G.U. RETURNER',
        'dot hack gu returner',
        'どっとはっくじーゆーりたーなー',
      ],
      relations: [
        'https://anidb.net/anime/5459',
        'https://anilist.co/anime/3269',
        'https://anilist.co/anime/48',
        'https://anilist.co/anime/873',
        'https://anime-planet.com/anime/hack-g-u-trilogy',
        'https://anime-planet.com/anime/hack-g-u-trilogy-parody',
        'https://anime-planet.com/anime/hack-gift',
        'https://anime-planet.com/anime/hack-legend-of-the-twilight',
        'https://anime-planet.com/anime/hack-liminality',
        'https://anime-planet.com/anime/hack-quantum',
        'https://anime-planet.com/anime/hack-quantum-go-our-chim-chims',
        'https://anime-planet.com/anime/hack-roots',
        'https://anime-planet.com/anime/hack-sign',
        'https://anime-planet.com/anime/hack-sign-intermezzo',
        'https://anime-planet.com/anime/hack-sign-unison',
        'https://anime-planet.com/anime/hack-the-movie',
        'https://anime-planet.com/anime/hack-versus-the-thanatos-report',
        'https://anisearch.com/anime/3564',
        'https://anisearch.com/anime/4491',
        'https://kitsu.io/anime/2895',
        'https://kitsu.io/anime/30',
        'https://kitsu.io/anime/773',
        'https://livechart.me/anime/3828',
        'https://livechart.me/anime/4186',
        'https://livechart.me/anime/4682',
        'https://livechart.me/anime/4721',
        'https://livechart.me/anime/4724',
        'https://livechart.me/anime/5077',
        'https://livechart.me/anime/5128',
        'https://livechart.me/anime/5159',
        'https://livechart.me/anime/5285',
        'https://livechart.me/anime/5416',
        'https://livechart.me/anime/5621',
        'https://livechart.me/anime/5891',
        'https://livechart.me/anime/6496',
        'https://livechart.me/anime/6697',
        'https://livechart.me/anime/7511',
        'https://myanimelist.net/anime/3269',
        'https://myanimelist.net/anime/48',
        'https://myanimelist.net/anime/873',
        'https://notify.moe/anime/xpIt5Fiig',
        'https://notify.moe/anime/z5OQcKiiR',
        'https://notify.moe/anime/z9uA5Fiig',
      ],
      tags: [
        'action',
        'adventure',
        'alternative world',
        'drama',
        'fantasy',
        'fantasy world',
        'game',
        'magic',
        'mmorpg',
        'new',
        'rpg',
        'sci-fi',
        'science fiction',
        'science-fiction',
        'video game',
        'virtual reality',
        'virtual world',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/5459',
        'https://anilist.co/anime/3269',
        'https://anime-planet.com/anime/hack-g-u-trilogy',
        'https://anisearch.com/anime/4491',
        'https://kitsu.io/anime/2895',
        'https://livechart.me/anime/4721',
        'https://myanimelist.net/anime/3269',
        'https://notify.moe/anime/z5OQcKiiR',
      ],
      title: '.hack//G.U. Trilogy',
      type: Type.Movie,
      episodes: 1,
      status: Status.Finished,
      animeSeason: {
        season: Season.Fall,
        year: 2007,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/4/23083.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/4/23083t.jpg',
      synonyms: [
        '.hack // G.U. Trilogy',
        '.hack//G.U. TRILOGY',
        '.hack//G.U. Трилогія',
        'Dot hack//G.U. Trilogy',
        'dot hack gu trilogy',
        'gu trilogy',
        'どっとはっくじーゆーとりろじー',
      ],
      relations: [
        'https://anidb.net/anime/4324',
        'https://anidb.net/anime/5391',
        'https://anilist.co/anime/110286',
        'https://anilist.co/anime/2928',
        'https://anilist.co/anime/4469',
        'https://anilist.co/anime/873',
        'https://anime-planet.com/anime/hack-g-u-returner',
        'https://anime-planet.com/anime/hack-g-u-trilogy-parody',
        'https://anime-planet.com/anime/hack-gift',
        'https://anime-planet.com/anime/hack-legend-of-the-twilight',
        'https://anime-planet.com/anime/hack-liminality',
        'https://anime-planet.com/anime/hack-quantum',
        'https://anime-planet.com/anime/hack-quantum-go-our-chim-chims',
        'https://anime-planet.com/anime/hack-roots',
        'https://anime-planet.com/anime/hack-sign',
        'https://anime-planet.com/anime/hack-sign-intermezzo',
        'https://anime-planet.com/anime/hack-sign-unison',
        'https://anime-planet.com/anime/hack-the-movie',
        'https://anime-planet.com/anime/hack-versus-the-thanatos-report',
        'https://kitsu.io/anime/2652',
        'https://kitsu.io/anime/3625',
        'https://kitsu.io/anime/773',
        'https://livechart.me/anime/3828',
        'https://livechart.me/anime/4186',
        'https://livechart.me/anime/4682',
        'https://livechart.me/anime/4717',
        'https://livechart.me/anime/4724',
        'https://livechart.me/anime/5077',
        'https://livechart.me/anime/5128',
        'https://livechart.me/anime/5159',
        'https://livechart.me/anime/5285',
        'https://livechart.me/anime/5416',
        'https://livechart.me/anime/5621',
        'https://livechart.me/anime/5891',
        'https://livechart.me/anime/6496',
        'https://livechart.me/anime/6697',
        'https://livechart.me/anime/7511',
        'https://myanimelist.net/anime/2928',
        'https://myanimelist.net/anime/36646',
        'https://myanimelist.net/anime/4469',
        'https://myanimelist.net/anime/873',
        'https://notify.moe/anime/-Tlu5KimR',
        'https://notify.moe/anime/NCh85FiiR',
        'https://notify.moe/anime/z9uA5Fiig',
      ],
      tags: [
        'action',
        'adventure',
        'alternative world',
        'cg animation',
        'cg-anime',
        'cyberpunk',
        'drama',
        'fantasy',
        'full cgi',
        'game',
        'mmorpg',
        'new',
        'rpg',
        'sci-fi',
        'science fiction',
        'science-fiction',
        'super power',
        'video game',
        'video games',
        'virtual reality',
        'virtual world',
      ],
    },
    {
      sources: [
        'https://anidb.net/anime/8692',
        'https://anilist.co/anime/11757',
        'https://anime-planet.com/anime/sword-art-online',
        'https://anisearch.com/anime/7335',
        'https://kitsu.io/anime/6589',
        'https://livechart.me/anime/1038',
        'https://myanimelist.net/anime/11757',
        'https://notify.moe/anime/FelStKimR',
      ],
      title: 'Sword Art Online',
      type: Type.Tv,
      episodes: 25,
      status: Status.Finished,
      animeSeason: {
        season: Season.Summer,
        year: 2012,
      },
      picture: 'https://cdn.myanimelist.net/images/anime/11/39717.jpg',
      thumbnail: 'https://cdn.myanimelist.net/images/anime/11/39717t.jpg',
      synonyms: [
        'S.A.O',
        'SAO',
        'SAO1',
        'Sword Art Online: Aincrad',
        'Sword Art Online: Fairy Dance',
        'Мастер меча онлайн',
        'אומנות החרב אונליין',
        'فن السيف عبر الإنترنت',
        'فن السيف عبر الانترنت',
        'هنر شمشیر زنی آنلاین',
        'ซอร์ดอาร์ตออนไลน์',
        'そーどあーとおんらいん',
        'ソードアート・オンライン',
        '刀剑神域',
        '刀劍神域',
        '소드 아트 온라인',
      ],
      relations: [
        'https://anidb.net/anime/10022',
        'https://anidb.net/anime/15735',
        'https://anidb.net/anime/8691',
        'https://anilist.co/anime/124140',
        'https://anilist.co/anime/16099',
        'https://anilist.co/anime/20021',
        'https://anilist.co/anime/20594',
        'https://anime-planet.com/anime/sword-art-online-alicization',
        'https://anime-planet.com/anime/sword-art-online-alicization-war-of-underworld',
        'https://anime-planet.com/anime/sword-art-online-alicization-war-of-underworld-part-ii',
        'https://anime-planet.com/anime/sword-art-online-alternative-gun-gale-online',
        'https://anime-planet.com/anime/sword-art-online-alternative-gun-gale-online-refrain',
        'https://anime-planet.com/anime/sword-art-online-extra-edition',
        'https://anime-planet.com/anime/sword-art-online-fatal-bullet-the-third-episode',
        'https://anime-planet.com/anime/sword-art-online-ii',
        'https://anime-planet.com/anime/sword-art-online-ii-debriefing',
        'https://anime-planet.com/anime/sword-art-online-ii-sword-art-offline-ii',
        'https://anime-planet.com/anime/sword-art-online-movie-ordinal-scale',
        'https://anime-planet.com/anime/sword-art-online-progressive-movie-1-aria-of-a-starless-night',
        'https://anime-planet.com/anime/sword-art-online-progressive-movie-2-scherzo-of-deep-night',
        'https://anime-planet.com/anime/sword-art-online-sword-art-offline',
        'https://anime-planet.com/anime/sword-art-online-sword-art-offline-extra-edition',
        'https://anisearch.com/anime/10913',
        'https://anisearch.com/anime/12852',
        'https://anisearch.com/anime/14175',
        'https://anisearch.com/anime/14323',
        'https://anisearch.com/anime/14663',
        'https://anisearch.com/anime/14847',
        'https://anisearch.com/anime/15501',
        'https://anisearch.com/anime/15547',
        'https://anisearch.com/anime/16727',
        'https://anisearch.com/anime/9077',
        'https://anisearch.com/anime/9323',
        'https://anisearch.com/anime/9918',
        'https://kitsu.io/anime/7372',
        'https://kitsu.io/anime/7914',
        'https://livechart.me/anime/10159',
        'https://livechart.me/anime/1017',
        'https://livechart.me/anime/10864',
        'https://livechart.me/anime/1750',
        'https://livechart.me/anime/1859',
        'https://livechart.me/anime/186',
        'https://livechart.me/anime/2908',
        'https://livechart.me/anime/2909',
        'https://livechart.me/anime/3148',
        'https://livechart.me/anime/391',
        'https://livechart.me/anime/392',
        'https://livechart.me/anime/9404',
        'https://livechart.me/anime/9733',
        'https://myanimelist.net/anime/16099',
        'https://myanimelist.net/anime/20021',
        'https://myanimelist.net/anime/42916',
        'https://notify.moe/anime/8ghFpKimg',
        'https://notify.moe/anime/Bp-2jsdGg',
        'https://notify.moe/anime/ZaihpKiig',
      ],
      tags: [
        'action',
        'action drama',
        'adventure',
        'alternative world',
        'amnesia',
        'angst',
        'artificial intelligence',
        'asia',
        'based on a light novel',
        'contemporary fantasy',
        'death game',
        'drama',
        'dungeon',
        'elves',
        'fantasy',
        'female harem',
        'female protagonist',
        'game',
        'hero of strong character',
        'heterosexual',
        'high fantasy',
        'high stakes games',
        'inseki',
        'isekai',
        'japan',
        'love polygon',
        'magic',
        'male protagonist',
        'mmorpg',
        'monster',
        'novel',
        'overpowered main characters',
        'present',
        'primarily teen cast',
        'pve',
        'pvp',
        'rape',
        'romance',
        'rpg',
        'sci fi',
        'science fiction',
        'science-fiction',
        'seinen',
        'struggle to survive',
        'swordplay',
        'swords & co',
        'thriller',
        'tragedy',
        'trapped in a video game',
        'video game',
        'video games',
        'violence',
        'virtual reality',
        'virtual world',
      ],
    },
  ],
};
