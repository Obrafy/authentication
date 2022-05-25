import { ExceptionFilter, Catch, HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from 'src/config';

import { mongo } from 'mongoose';

import { getLanguageSpecificErrorMessage } from 'src/common/error-messages/error-messages.helpers';
import { DATABASE_ERROR_MESSAGES_KEYS } from '../error-messages/error-messages.interface';

const DUPLICATE_KEY_MONGO_ERROR_CODE = 11000;

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
    // Handle Mongo Errors
    if (exception instanceof mongo.MongoError) {
      // Handle Duplicate Key Errors
      if (exception.code == DUPLICATE_KEY_MONGO_ERROR_CODE) {
        let replaceArray = undefined;

        if ((exception as any).keyValue) {
          replaceArray = [
            { key: 'key', value: Object.keys((exception as any).keyValue)[0] },
            { key: 'value', value: Object.values((exception as any).keyValue)[0] as string },
          ];
        }

        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: [
            getLanguageSpecificErrorMessage(
              this.configService.get('LANGUAGE', { infer: true }),
              DATABASE_ERROR_MESSAGES_KEYS.DUPLICATE_KEY,
              replaceArray,
            ),
          ],
          data: null,
        };
      }

      // Hanle generic database errors
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [exception.message],
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
