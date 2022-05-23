import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';
import {
  ActivateUserByIdRequest,
  DeactivateUserByIdRequest,
  FindUserByIdRequest,
  LoginRequest,
  RegisterRequest,
  RemoveUserByIdRequest,
  ValidateRequest,
} from './proto/auth.pb';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}

export class FindUserByIdRequestDto implements FindUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class ActivateUserByIdRequestDto implements ActivateUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class DeactivateUserByIdRequestDto implements DeactivateUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class RemoveUserByIdRequestDto implements RemoveUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}
