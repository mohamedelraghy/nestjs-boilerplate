import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorObject } from './error-object.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { url, method } = request;
    const requestId = request.session.id;
    const timestamp = new Date().toDateString();

    // Catch HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorMessage = exception.getResponse() as HttpException;

      const errorObject: ErrorObject = {
        statusCode: exception.getStatus(),
        method,
        url,
        timestamp,
        ...errorMessage,
      };

      this.logger.warn({ requestId, errorObject });

      return response.status(status).json(errorObject);
    }

    // catch errors with statusCode 5xx
    const status = exception.graph
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log({ status }, exception.graph);
    const errorObject: ErrorObject = {
      statusCode: status,
      method,
      url,
      timestamp,
    };

    if (exception instanceof Error) {
      errorObject.error = exception.name;
      errorObject.message = exception.message;
    } else {
      errorObject.error = 'INTERNAL SERVER';
    }

    this.logger.error({ requestId, errorObject });

    return response.status(status).json(errorObject);
  }
}
