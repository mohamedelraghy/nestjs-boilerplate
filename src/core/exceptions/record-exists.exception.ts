import { BadRequestException } from '@nestjs/common';

export class RecordExistsException extends BadRequestException {
  constructor(record: string) {
    super(`${record} already exists`);
  }
}
