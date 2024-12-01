import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type { Request } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | undefined = undefined;
    switch (true) {
      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case exception instanceof QueryFailedError:
        status = HttpStatus.CONFLICT;
        if (exception.message.includes('duplicate key value')) {
          message = 'One of the fields is unique';
        }
        break;
      case exception instanceof EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        break;
      case exception instanceof CannotCreateEntityIdMapError:
        status = HttpStatus.BAD_REQUEST;
        break;
    }

    response
      .status(status)
      .json(this._response(status, request, exception, message));
  }

  private _response(
    status: number,
    request: Request,
    exception: any,
    message?: string,
  ) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      method: request?.method,
      params: request?.params,
      query: request?.query,
      exception: {
        name: exception['name'],
        message: message || exception['message'],
      },
    };
  }
}
