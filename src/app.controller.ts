import { Controller, Get, Query } from '@nestjs/common';
import { AnimeDbService } from './animedb.service';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  async getAnimeById(@Query('id') id: string) {
    return this.animedbService.getAnimeById(id);
  }
}
