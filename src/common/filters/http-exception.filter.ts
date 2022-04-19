import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context: HttpArgumentsHost = host.switchToHttp();

    const respose: Response = context.getResponse<Response>();
    const request: Request = context.getRequest<Request>();

    const httpStatus: HttpStatus = exception.getStatus();

    if (httpStatus === HttpStatus.BAD_REQUEST) {
      const response: any = exception.getResponse();

      return { status: httpStatus, error: response.message };
    }

    respose.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
