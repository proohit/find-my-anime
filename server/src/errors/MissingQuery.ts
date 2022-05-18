import { HttpException } from '@nestjs/common';

export class MissingQuery extends HttpException {
  constructor(query: string) {
    super(`Missing query parameter: ${query}`, 400);
  }
}
