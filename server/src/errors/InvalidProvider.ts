import { HttpException } from '@nestjs/common';

export class InvalidEnum extends HttpException {
  constructor(enumType: object) {
    super(
      `Invalid enum value. Valid values: ${Object.values(enumType).join(', ')}`,
      400,
    );
  }
}
