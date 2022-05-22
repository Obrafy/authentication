import { ExceptionFilter, Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const httpStatus: HttpStatus = exception.getStatus();

    const response: any = exception.getResponse();

    return {
      status: httpStatus,
      error: Array.isArray(response.message) ? response.message : [response.message],
      data: null,
    };
  }
}
