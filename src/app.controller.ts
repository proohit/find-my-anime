import { Controller, Get, Query } from '@nestjs/common';
import { AnimeDbService } from './animedb.service';

@Controller()
export class AppController {
  constructor(private readonly animedbService: AnimeDbService) {}

  @Get()
  getAnimeById(@Query('id') id: string): any {
    return this.animedbService.getAnimeById(id);
  }
}
