import { Anime } from '@find-my-anime/shared/interfaces/AnimeDb';
import { DbStatistics } from '@find-my-anime/shared/interfaces/DbStatistics';
import { Injectable } from '@nestjs/common';
import { AnimeDbService } from '../animedb/animedb.service';

@Injectable()
export class StatsService {
  constructor(private readonly animedbService: AnimeDbService) {}

  async getStats(): Promise<DbStatistics> {
    const allAnime = await this.animedbService.getAllAnime();
    const sortedMostUsedTags = this.getMostUsedTags(allAnime);
    const tags = await this.animedbService.getTags();
    const stats = {
      anime: {
        count: allAnime.length,
      },
      tags: {
        count: tags.length,
        mostUsedTags: sortedMostUsedTags,
      },
    };
    return stats;
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
