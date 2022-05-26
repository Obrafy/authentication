import * as _ from 'lodash';
import * as langFiles from './lang';
import { ERROR_MESSAGE_KEYS } from '../error-messages/error-messages.interface';

const languageToFileNameMap = {
  'pt-br': 'ptBr',
  'en-us': 'enUs',
};

type BuildErrorMessageOptions = {
  replaceablePairs?: Record<any, string>;
};

type ParseErrorMessageOptions = {
  language: keyof typeof languageToFileNameMap;
};

export const getLanguageSpecificErrorMessage = (
  language: keyof typeof languageToFileNameMap,
  errorMessageKey: ERROR_MESSAGE_KEYS | string,
  replaceablePairs?: Record<any, string>,
) => {
  const errorMessage: string = _.get(langFiles[languageToFileNameMap[language]], errorMessageKey);

  if (replaceablePairs) {
    return Object.keys(replaceablePairs).reduce((currErrorMessage, key) => {
      const regexp = new RegExp(`:${key}:`, 'ig');
      return currErrorMessage.replace(regexp, replaceablePairs[key]);
    }, errorMessage);
  }

  return errorMessage;
};

export const buildErrorMessage = (key: ERROR_MESSAGE_KEYS, options?: BuildErrorMessageOptions) => {
  return JSON.stringify({ key, options });
};

export const parseErrorMessage = (message: string, options: ParseErrorMessageOptions) => {
  try {
    const errorMessageObj = JSON.parse(message);

    if (!errorMessageObj.key || !errorMessageObj.options) {
      throw new Error('Invalid errorMessageObj');
    }

    return (
      getLanguageSpecificErrorMessage(
        options.language,
        errorMessageObj.key,
        errorMessageObj.options.replaceablePairs,
      ) ?? message
    );
  } catch (err) {
    return getLanguageSpecificErrorMessage(options.language, message) ?? message;
  }
};
