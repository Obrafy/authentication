import { IsEmail, IsEnum, IsMongoId, IsString, MinLength } from 'class-validator';
import * as PROTO from './proto/auth.pb';
import { Role } from '../entities/role.enum';
import { TransformRoleEnum } from 'src/common/decorators/transform-role.decorator';

export class LoginRequestDto implements PROTO.LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements PROTO.RegisterRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;
}

export class ValidateRequestDto implements PROTO.ValidateRequest {
  @IsString()
  public readonly token: string;
}

export class FindUserByIdRequestDto implements PROTO.FindUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class ActivateUserByIdRequestDto implements PROTO.ActivateUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class DeactivateUserByIdRequestDto implements PROTO.DeactivateUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class RemoveUserByIdRequestDto implements PROTO.RemoveUserByIdRequest {
  @IsMongoId()
  public readonly userId: string;
}

export class AddRoleToUserRequestDto implements PROTO.AddRoleToUserRequest {
  @IsMongoId()
  public readonly userId: string;

  @TransformRoleEnum()
  @IsEnum(Role, { message: `role must be a valid Role (${Object.keys(Role).join(', ')})` })
  public readonly role: Role;
}

export class RemoveRoleFromUserRequestDto implements PROTO.RemoveRoleFromUserRequest {
  @IsMongoId()
  public readonly userId: string;

  @TransformRoleEnum()
  @IsEnum(Role, { message: `role must be a valid Role (${Object.keys(Role).join(', ')})` })
  public readonly role: Role;
}
