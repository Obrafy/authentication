import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import makeResponse from 'src/common/helpers/make-response';

import { FindUserByIdRequestDto, LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from './dto/auth.dto';
import {
  AUTH_SERVICE_NAME,
  RegisterResponse,
  LoginResponse,
  ValidateResponse,
  FindUserByIdResponse,
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
    const user = await this.service.findUserById(payload);

    return makeResponse<FindUserByIdResponse>({
      user: {
        email: user.email,
        roles: user.roles,
        // Casting dates to integer for gRPC
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
        lastLogin: user.lastLogin && user.lastLogin.getTime(),
      },
    });
  }
}
