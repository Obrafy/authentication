import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import makeResponse from 'src/common/helpers/make-response';

import {
  ActivateUserByIdRequestDto,
  DeactivateUserByIdRequestDto,
  FindUserByIdRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  RemoveUserByIdRequestDto,
  ValidateRequestDto,
} from './dto/auth.dto';
import {
  AUTH_SERVICE_NAME,
  RegisterResponse,
  LoginResponse,
  ValidateResponse,
  FindUserByIdResponse,
  ActivateUserByIdResponse,
  DeactivateUserByIdResponse,
  RemoveUserByIdResponse,
} from './dto/proto/auth.pb';

import { AuthService } from './services/auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  private async register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    const registeredUser = await this.service.register(payload);

    return makeResponse<RegisterResponse>({ userId: registeredUser._id });
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  private async login(payload: LoginRequestDto): Promise<LoginResponse> {
    const token = await this.service.login(payload);
    return makeResponse<LoginResponse>({ token });
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  private async validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    const user = await this.service.validate(payload);
    return makeResponse<ValidateResponse>({ userId: user._id });
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'FindUserById')
  private async findUserById(payload: FindUserByIdRequestDto): Promise<FindUserByIdResponse> {
    const userData = await this.service.findUserById(payload);

    return makeResponse<FindUserByIdResponse>({
      user: {
        email: userData.email,
        roles: userData.roles,
        status: userData.status,
        // Casting dates to integer for gRPC
        createdAt: userData.createdAt.getTime(),
        updatedAt: userData.updatedAt.getTime(),
        lastLogin: userData.lastLogin && userData.lastLogin.getTime(),
      },
    });
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ActivateUserById')
  private async activateUserById(payload: ActivateUserByIdRequestDto): Promise<ActivateUserByIdResponse> {
    await this.service.activateUserById(payload);

    return makeResponse<ActivateUserByIdResponse>(null);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'DeactivateUserById')
  private async deactivateUserById(payload: DeactivateUserByIdRequestDto): Promise<DeactivateUserByIdResponse> {
    await this.service.deactivateUserById(payload);

    return makeResponse<DeactivateUserByIdResponse>(null);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'RemoveUserById')
  private async removeUserById(payload: RemoveUserByIdRequestDto): Promise<RemoveUserByIdResponse> {
    await this.service.removeUserById(payload);

    return makeResponse<RemoveUserByIdResponse>(null);
  }
}
