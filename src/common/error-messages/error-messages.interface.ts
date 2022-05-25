// Error Messages Interfaces
interface AuthenticationErrorMessages {
  USER_ALREADY_EXISTS: string;
  USER_NOT_FOUND: string;
  USER_NOT_ACTIVE: string;
  INVALID_PASSWORD: string;
  INVALID_TOKEN: string;
  AT_LEAST_ONE_ROLE: string;
}

interface DatabaseErrorMessages {
  DUPLICATE_KEY: string;
}

export interface ErrorMessages {
  AUTHENTICATION_SERVICE: AuthenticationErrorMessages;
  DATABASE: DatabaseErrorMessages;
}

// Error Messages Key Enums
export enum AUTHENTICATION_ERROR_MESSAGES_KEYS {
  USER_ALREADY_EXISTS = 'AUTHENTICATION_SERVICE.USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'AUTHENTICATION_SERVICE.USER_NOT_FOUND',
  USER_NOT_ACTIVE = 'AUTHENTICATION_SERVICE.USER_NOT_ACTIVE',
  INVALID_PASSWORD = 'AUTHENTICATION_SERVICE.INVALID_PASSWORD',
  INVALID_TOKEN = 'AUTHENTICATION_SERVICE.INVALID_TOKEN',
  AT_LEAST_ONE_ROLE = 'AUTHENTICATION_SERVICE.AT_LEAST_ONE_ROLE',
}

export enum DATABASE_ERROR_MESSAGES_KEYS {
  DUPLICATE_KEY = 'DATABASE.DUPLICATE_KEY',
}
