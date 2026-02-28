import { ANIDB_API_URL } from '@find-my-anime/shared/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import xmljs from 'xml-js';
import { AnimedbResult } from './AnidbResult';
import { AnimeClient } from './AnimeClient';

@Injectable()
export class AniDbClient implements AnimeClient {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  public async getAnime(id: string) {
    const query = new URLSearchParams();
    query.append('client', this.configService.getOrThrow('ANIDB_CLIENT_ID'));
    query.append(
      'clientver',
      this.configService.getOrThrow('ANIDB_CLIENT_VERSION'),
    );
    query.append('request', 'anime');
    query.append('protover', '1');
    query.append('aid', id);

    const url = `${ANIDB_API_URL}?${query}`;
    const data = await this.get(url);
    if (data.error && data.error._text) {
      throw new Error(JSON.stringify(data.error._text));
    }
    if (!data.anime?.description._text) {
      throw new Error('Anime description is missing in the response');
    }
    const description = data.anime.description._text;
    return { description };
  }

  private async get(url: string) {
    const res = await lastValueFrom(this.httpService.get(url));
    return xmljs.xml2js(res.data, {
      compact: true,
    }) as AnimedbResult;
  }
}
