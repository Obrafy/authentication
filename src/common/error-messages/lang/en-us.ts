import { ErrorMessages } from '../error-messages.interface';

const errorMessagesEnUs: ErrorMessages = {
  AUTHENTICATION_SERVICE: {
    USER_ALREADY_EXISTS: 'a user already exists for the given email',
    USER_NOT_FOUND: 'the user was not found',
    USER_NOT_ACTIVE: 'the user has been found but is not active',
    INVALID_PASSWORD: 'the informed password is invalid',
    INVALID_TOKEN: 'the provided token is not valid',
    AT_LEAST_ONE_ROLE: 'the user must have at least one active role at all times',
  },
};

export default errorMessagesEnUs;
