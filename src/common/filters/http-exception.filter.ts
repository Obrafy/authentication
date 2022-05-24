import { ExceptionFilter, Catch, HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from 'src/config';
import { getLanguageSpecificErrorMessage } from '../error-messages/error-messages.helpers';
@Injectable()
@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService<ConfigInterface>) {}

  catch(exception: unknown) {
    if (exception instanceof HttpException) {
      const httpStatus: HttpStatus = exception.getStatus();

      const response: any = exception.getResponse();

      // Translate error messages if possible
      const errorMessages = [];

      if (Array.isArray(response.message)) {
        response.message.forEach((r: string) =>
          errorMessages.push(
            getLanguageSpecificErrorMessage(this.configService.get('LANGUAGE', { infer: true }), r) ?? r,
          ),
        );
      } else {
        errorMessages.push(
          getLanguageSpecificErrorMessage(this.configService.get('LANGUAGE', { infer: true }), response.message) ??
            response.message,
        );
      }

      return {
        status: httpStatus,
        error: errorMessages,
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
