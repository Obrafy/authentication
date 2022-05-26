// Error Messages Interfaces

interface DatabaseErrorMessages {
  DUPLICATE_KEY: string;
}
interface AuthenticationErrorMessages {
  USER_ALREADY_EXISTS: string;
  USER_NOT_FOUND: string;
  USER_NOT_ACTIVE: string;
  INVALID_PASSWORD: string;
  INVALID_TOKEN: string;
  AT_LEAST_ONE_ROLE: string;
}

interface SkillErrorMessages {
  SKILL_CATEGORY_NOT_FOUND: string;
  SKILL_NOT_FOUND: string;
}

interface ValidationErrorMessages {
  INVALID_ROLE: string;
}

export interface ErrorMessages {
  DATABASE: DatabaseErrorMessages;
  AUTHENTICATION_SERVICE: AuthenticationErrorMessages;
  SKILL_SERVICE: SkillErrorMessages;
  VALIDATION: ValidationErrorMessages;
}

// Error Messages Key Enums
export enum DATABASE_ERROR_MESSAGES_KEYS {
  DUPLICATE_KEY = 'DATABASE.DUPLICATE_KEY',
}

export enum AUTHENTICATION_ERROR_MESSAGES_KEYS {
  USER_ALREADY_EXISTS = 'AUTHENTICATION_SERVICE.USER_ALREADY_EXISTS',
  USER_NOT_FOUND = 'AUTHENTICATION_SERVICE.USER_NOT_FOUND',
  USER_NOT_ACTIVE = 'AUTHENTICATION_SERVICE.USER_NOT_ACTIVE',
  INVALID_PASSWORD = 'AUTHENTICATION_SERVICE.INVALID_PASSWORD',
  INVALID_TOKEN = 'AUTHENTICATION_SERVICE.INVALID_TOKEN',
  AT_LEAST_ONE_ROLE = 'AUTHENTICATION_SERVICE.AT_LEAST_ONE_ROLE',
}

export enum SKILL_ERROR_MESSAGES_KEYS {
  SKILL_CATEGORY_NOT_FOUND = 'SKILL_SERVICE.SKILL_CATEGORY_NOT_FOUND',
  SKILL_NOT_FOUND = 'SKILL_SERVICE.SKILL_NOT_FOUND',
}

export enum VALIDATION_ERROR_MESSAGES_KEYS {
  INVALID_ROLE = 'VALIDATION.INVALID_ROLE',
}

export type ERROR_MESSAGE_KEYS =
  | DATABASE_ERROR_MESSAGES_KEYS
  | AUTHENTICATION_ERROR_MESSAGES_KEYS
  | SKILL_ERROR_MESSAGES_KEYS
  | VALIDATION_ERROR_MESSAGES_KEYS;
