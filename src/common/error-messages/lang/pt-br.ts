import { ErrorMessages } from '../error-messages.interface';

const errorMessagesPtBr: ErrorMessages = {
  DATABASE: {
    DUPLICATE_KEY: 'um registro já existe para a chave única `:key:` com o valor `:value:`',
  },
  AUTHENTICATION_SERVICE: {
    USER_ALREADY_EXISTS: 'um usuário já existe para o email informado',
    USER_NOT_FOUND: 'o usuário não foi encontrado',
    USER_NOT_ACTIVE: 'o usuário foi encontrado porém não está ativo',
    INVALID_PASSWORD: 'a senha informada está incorreta',
    INVALID_TOKEN: 'o token informado não é valido',
    AT_LEAST_ONE_ROLE: 'o usuário deve sempre ter ao menos uma role ativa',
  },
  SKILL_SERVICE: {
    SKILL_NOT_FOUND: 'a habilidade não foi encontrada',
    SKILL_CATEGORY_NOT_FOUND: 'a categoria de habilidade não foi encontrada',
  },
};

export default errorMessagesPtBr;
