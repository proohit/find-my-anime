import { ANILIST_API_URL } from '@find-my-anime/shared/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AnimeClient } from './AnimeClient';
@Injectable()
export class AnilistClient implements AnimeClient {
  constructor(private httpService: HttpService) {}

  async getAnime(id: string) {
    const query = `query ($id: Int) {
      Media(id: $id) {
        title {
          romaji
          english
        }
        description
      }
    }`;
    const variables = { id };
    try {
      const data = await this.fetch(query, variables);
      if (!data.Media || data.errors) {
        throw new Error(JSON.stringify(data));
      }
      return data.Media;
    } catch (error) {
      throw new Error(`Couldn't query media for id ${id}`);
    }
  }

  private async fetch(query: string, variables: any) {
    const body: { query?: string; variables?: any } = {};
    if (query) {
      body.query = query;
    }
    if (query && variables) {
      body.variables = variables;
    }
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const res = await lastValueFrom(
      this.httpService.post(ANILIST_API_URL, JSON.stringify(body), options),
    );
    const json = res.data;
    if (!json.data || json?.errors?.length > 0) {
      throw new Error(JSON.stringify(json.errors));
    }
    return json.data;
  }
}
