import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import makeResponse from 'src/common/helpers/make-response';

import * as DTO from './dto/auth.dto';
import * as PROTO from './dto/proto/auth.pb';

import { AuthService } from './services/auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'Register')
  private async register(payload: DTO.RegisterRequestDto): Promise<PROTO.RegisterResponse> {
    const registeredUser = await this.service.register(payload);

    return makeResponse<PROTO.RegisterResponse>({ userId: registeredUser._id });
  }

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'Login')
  private async login(payload: DTO.LoginRequestDto): Promise<PROTO.LoginResponse> {
    const token = await this.service.login(payload);
    return makeResponse<PROTO.LoginResponse>({ token });
  }

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'Validate')
  private async validate(payload: DTO.ValidateRequestDto): Promise<PROTO.ValidateResponse> {
    const user = await this.service.validate(payload);
    return makeResponse<PROTO.ValidateResponse>({ userId: user._id });
  }

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'FindUserById')
  private async findUserById(payload: DTO.FindUserByIdRequestDto): Promise<PROTO.FindUserByIdResponse> {
    const userData = await this.service.findUserById(payload);

    return makeResponse<PROTO.FindUserByIdResponse>({
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

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'ActivateUserById')
  private async activateUserById(payload: DTO.ActivateUserByIdRequestDto): Promise<PROTO.ActivateUserByIdResponse> {
    await this.service.activateUserById(payload);

    return makeResponse<PROTO.ActivateUserByIdResponse>(null);
  }

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'DeactivateUserById')
  private async deactivateUserById(
    payload: DTO.DeactivateUserByIdRequestDto,
  ): Promise<PROTO.DeactivateUserByIdResponse> {
    await this.service.deactivateUserById(payload);

    return makeResponse<PROTO.DeactivateUserByIdResponse>(null);
  }

  @GrpcMethod(PROTO.AUTH_SERVICE_NAME, 'RemoveUserById')
  private async removeUserById(payload: DTO.RemoveUserByIdRequestDto): Promise<PROTO.RemoveUserByIdResponse> {
    await this.service.removeUserById(payload);

    return makeResponse<PROTO.RemoveUserByIdResponse>(null);
  }
}
