import { MYANIMELIST_API_URL } from '@find-my-anime/shared/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnimeClient } from './AnimeClient';

@Injectable()
export class MyAnimeListClient implements AnimeClient {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  public async getAnime(id: string, externalFields?: string[]) {
    const query = new URLSearchParams();

    query.append('fields', externalFields?.join(',') || '');
    const url = `${MYANIMELIST_API_URL}/anime/${id}?${query}`;
    const data = await this.get(url);
    if (!data) {
      throw new Error(`Could not fetch MAL Anime data for id ${id}`);
    }
    if ('error' in data) {
      throw new Error(JSON.stringify(data));
    }
    return { description: data.synopsis };
  }

  private async get(url: string) {
    const newOptions = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-MAL-CLIENT-ID': `${this.configService.get('MYANIMELIST_API_KEY')}`,
      },
    };

    const res = await lastValueFrom(
      this.httpService.get<{ synopsis: string } | { error: string }>(
        url,
        newOptions,
      ),
    );
    return res.data;
  }
}
