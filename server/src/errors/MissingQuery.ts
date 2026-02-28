import { HttpException } from '@nestjs/common';

export class MissingQuery extends HttpException {
  constructor(query = 'unknown parameter') {
    super(`Missing query parameter: ${query}`, 400);
  }
}
