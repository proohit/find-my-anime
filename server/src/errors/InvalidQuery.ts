import { HttpException } from '@nestjs/common';

export class InvalidQuery extends HttpException {
  constructor(query: string) {
    super(`Invalid query parameter: ${query}`, 400);
  }
}
