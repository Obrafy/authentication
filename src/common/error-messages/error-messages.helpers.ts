import * as _ from 'lodash';
import * as langFiles from './lang';

const languageToFileNameMap = {
  'pt-br': 'ptBr',
  'en-us': 'enUs',
};

export const getLanguageSpecificErrorMessage = (language: string, errorMessageKey: string) => {
  return _.get(langFiles[languageToFileNameMap[language]], errorMessageKey);
};
