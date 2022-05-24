import { ExceptionFilter, Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    if (exception instanceof HttpException) {
      const httpStatus: HttpStatus = exception.getStatus();

      const response: any = exception.getResponse();

      return {
        status: httpStatus,
        error: Array.isArray(response.message) ? response.message : [response.message],
        data: null,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ['An unknown error has occurred. Please check the logs.'],
      data: null,
    };
  }
}
