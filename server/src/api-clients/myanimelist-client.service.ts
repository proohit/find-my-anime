import { MYANIMELIST_API_URL } from '@find-my-anime/shared/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AnimeClient } from './AnimeClient';

@Injectable()
export class MyAnimeListClient implements AnimeClient {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  public async getAnime(id: string, fields?: string[]) {
    try {
      const query = new URLSearchParams({
        fields: fields?.join(','),
      }).toString();
      const url = `${MYANIMELIST_API_URL}/anime/${id}?${query}`;
      const data = await this.get(url);
      if (!data || data.error) {
        throw new Error(JSON.stringify(data));
      }
      return { description: data.synopsis };
    } catch (error) {
      Logger.error(error);
    }
  }

  private async get(url: string) {
    const newOptions = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-MAL-CLIENT-ID': `${this.configService.get('MYANIMELIST_API_KEY')}`,
      },
    };

    const res = await lastValueFrom(this.httpService.get(url, newOptions));
    const json = res.data;
    if (json?.error) {
      throw new Error(JSON.stringify(json.data));
    }
    return json;
  }
}
