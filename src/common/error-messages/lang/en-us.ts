import { ErrorMessages } from '../error-messages.interface';

const errorMessagesEnUs: ErrorMessages = {
  VALIDATION: {
    INVALID_ROLE: 'the provided user role is not valid. [Valid Roles: :valid_roles:]',
  },
  DATABASE: {
    DUPLICATE_KEY: 'a record already exists for key :key: and value :value: (duplicate entry)',
  },
  AUTHENTICATION_SERVICE: {
    USER_ALREADY_EXISTS: 'a user already exists for the given email',
    USER_NOT_FOUND: 'the user was not found',
    USER_NOT_ACTIVE: 'the user has been found but is not active',
    INVALID_PASSWORD: 'the informed password is invalid',
    INVALID_TOKEN: 'the provided token is not valid',
    AT_LEAST_ONE_ROLE: 'the user must have at least one active role at all times',
  },
  SKILL_SERVICE: {
    SKILL_NOT_FOUND: 'the skill was not found',
    SKILL_CATEGORY_NOT_FOUND: 'the skill category was not found',
  },
};

export default errorMessagesEnUs;
