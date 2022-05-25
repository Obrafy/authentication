import * as _ from 'lodash';
import * as langFiles from './lang';

const languageToFileNameMap = {
  'pt-br': 'ptBr',
  'en-us': 'enUs',
};

export const getLanguageSpecificErrorMessage = (
  language: string,
  errorMessageKey: string,
  replaceablePairs?: { key: string; value: string }[],
) => {
  const errorMessage: string = _.get(langFiles[languageToFileNameMap[language]], errorMessageKey);

  if (replaceablePairs) {
    return replaceablePairs.reduce((currErrorMessage, rp) => {
      const regexp = new RegExp(`:${rp.key}:`, 'ig');
      return currErrorMessage.replace(regexp, rp.value);
    }, errorMessage);
  }

  return errorMessage;
};
