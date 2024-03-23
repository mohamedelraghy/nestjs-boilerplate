import { NotFoundException } from '@nestjs/common';

export class RecordNotFoundException extends NotFoundException {
  constructor(record: string) {
    super(`${record} not found`);
  }
}
