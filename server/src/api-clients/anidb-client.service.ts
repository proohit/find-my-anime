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
    const query = new URLSearchParams({
      client: this.configService.get('ANIDB_CLIENT_ID'),
      clientver: this.configService.get('ANIDB_CLIENT_VERSION'),
      request: 'anime',
      protover: '1',
      aid: id,
    }).toString();

    const url = `${ANIDB_API_URL}?${query}`;
    const data = await this.get(url);
    if (data.error && data.error._text) {
      throw new Error(JSON.stringify(data.error._text));
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
