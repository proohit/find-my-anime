import { Season } from '@find-my-anime/shared/constants/Season';
import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { DbStatistics } from '@find-my-anime/shared/interfaces/DbStatistics';
import { Injectable } from '@nestjs/common';
import { AnimeDbService } from '../animedb/animedb.service';
import { TelemetryDataService } from './telemetry-data.service';

type SeasonYear = `${string}-${string}`;

@Injectable()
export class StatsService {
  constructor(
    private readonly animedbService: AnimeDbService,
    private readonly telemetryDataService: TelemetryDataService,
  ) {}

  async getStats(): Promise<DbStatistics> {
    const allAnime = await this.animedbService.getAllAnime();
    const sortedMostUsedTags = this.getMostUsedTags(allAnime);
    const seasons = this.getAnimeCountBySeasonAndYear(allAnime);
    const tags = await this.animedbService.getTags();
    const lastDownloaded = await this.animedbService.getLastDownloaded();
    const telemetry = await this.telemetryDataService.getTelemetryData();
    return {
      lastDownloaded,
      anime: {
        count: allAnime.length,
        seasons,
      },
      tags: {
        count: tags.length,
        mostUsedTags: sortedMostUsedTags,
      },
      telemetry,
    };
  }

  private getAnimeCountBySeasonAndYear(allAnime: Anime[]) {
    const seasons: Record<SeasonYear, number> = {};
    allAnime.forEach((anime) => {
      const season = anime.animeSeason.season;
      const year = anime.animeSeason.year;
      if (season === Season.Undefined || !year || isNaN(year)) {
        return;
      }
      const entry: SeasonYear = `${season}-${year}`;
      if (!seasons[entry]) {
        seasons[entry] = 1;
      } else {
        seasons[entry] = seasons[entry] + 1;
      }
    });
    const sortedSeasons: Record<`${string}-${string}`, number> = {};
    Object.entries(seasons)
      .sort((a, b) => {
        const aSeason = a[0].split('-')[0];
        const aYear = Number(a[0].split('-')[1]);
        const bSeason = b[0].split('-')[0];
        const bYear = Number(b[0].split('-')[1]);
        if (bYear > aYear) {
          return 1;
        } else if (bYear < aYear) {
          return -1;
        }
        const seasonOrder = {
          [Season.Spring]: '0',
          [Season.Summer]: '1',
          [Season.Fall]: '2',
          [Season.Winter]: '3',
        };
        const aSeasonYearNum = String(aYear).padStart(5, seasonOrder[aSeason]);
        const bSeasonYearNum = String(bYear).padStart(5, seasonOrder[bSeason]);
        return bSeasonYearNum.localeCompare(aSeasonYearNum);
      })
      .forEach(([season, count]) => (sortedSeasons[season] = count));
    return sortedSeasons;
  }

  private getMostUsedTags(allAnime: Anime[]) {
    const tagCountOverAnime: DbStatistics['tags']['mostUsedTags'] = {};
    allAnime.forEach((anime) => {
      anime.tags.forEach((tag) => {
        if (tagCountOverAnime[tag]) {
          tagCountOverAnime[tag] = tagCountOverAnime[tag] + 1;
        } else {
          tagCountOverAnime[tag] = 1;
        }
      });
    });
    const sortedMostUsedTags = {};
    Object.entries(tagCountOverAnime)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => (sortedMostUsedTags[tag] = count));
    return sortedMostUsedTags;
  }
}
