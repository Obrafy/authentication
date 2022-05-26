import { IsEmail, IsEnum, IsMongoId, IsString, MinLength } from 'class-validator';
import * as PROTO from 'src/common/dto/proto/auth.pb';
import { Role } from 'src/auth/entities/role.enum';
import { TransformRoleEnum } from 'src/common/decorators/transform-role.decorator';
import { VALIDATION_ERROR_MESSAGES_KEYS } from 'src/common/error-messages/error-messages.interface';
import { buildErrorMessage } from 'src/common/error-messages/error-messages.helpers';

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

export class FindUserByEmailRequestDto implements PROTO.FindUserByEmailRequest {
  @IsEmail()
  public readonly email: string;
}

export class FindAllUsersRequestDto implements PROTO.FindAllUsersRequest {}

export class FindAllUsersForRolesRequestDto implements PROTO.FindAllUsersForRolesRequest {
  @TransformRoleEnum()
  @IsEnum(Role, {
    message: buildErrorMessage(VALIDATION_ERROR_MESSAGES_KEYS.INVALID_ROLE, {
      replaceablePairs: { valid_roles: Object.keys(Role).join(', ') },
    }),
    each: true,
  })
  roles: PROTO.Role[];
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
