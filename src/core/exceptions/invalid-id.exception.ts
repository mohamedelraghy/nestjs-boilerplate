import { BadRequestException } from '@nestjs/common';

const message = 'id must be a mongodb id';

export class InvalidIdException extends BadRequestException {
  constructor() {
    super(message);
  }
}
