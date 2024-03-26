import {  HttpStatus } from '@nestjs/common';

export interface ErrorObject {
  statusCode: HttpStatus;
  method: string;
  url: string;
  timestamp: string;
  stack?: any;
  error?: any;
  message?: string;
}
