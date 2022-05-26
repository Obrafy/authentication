import { ExceptionFilter, Catch, HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from 'src/config';

import { mongo } from 'mongoose';

import { getLanguageSpecificErrorMessage, parseErrorMessage } from 'src/common/error-messages/error-messages.helpers';
import { DATABASE_ERROR_MESSAGES_KEYS, ERROR_MESSAGE_KEYS } from '../error-messages/error-messages.interface';

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
        response.message.forEach((r: ERROR_MESSAGE_KEYS | string) =>
          errorMessages.push(
            parseErrorMessage(r, { language: this.configService.get('SERVER_LANG', { infer: true }) }),
          ),
        );
      } else {
        errorMessages.push(
          parseErrorMessage(response.message, { language: this.configService.get('SERVER_LANG', { infer: true }) }),
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
        const replaceablePairs = {};

        if ((exception as any).keyValue) {
          replaceablePairs[Object.keys((exception as any).keyValue)[0]] = Object.values(
            (exception as any).keyValue,
          )[0] as string;
        }

        return {
          status: HttpStatus.CONFLICT,
          error: [
            getLanguageSpecificErrorMessage(
              this.configService.get('SERVER_LANG', { infer: true }),
              DATABASE_ERROR_MESSAGES_KEYS.DUPLICATE_KEY,
              replaceablePairs,
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
