import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';
import { FindUserByIdRequest, LoginRequest, RegisterRequest, ValidateRequest } from './proto/auth.pb';

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
