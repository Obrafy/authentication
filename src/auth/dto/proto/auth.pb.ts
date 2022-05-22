/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import * as Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

/** Role Enum */
export enum Role {
  USER = 0,
  ADMIN = 1,
  SUDO = 2,
  UNRECOGNIZED = -1,
}

/** User Message */
export interface User {
  email: string;
  lastLogin: number;
  roles: Role[];
  createdAt: number;
  updatedAt: number;
}

/** Register */
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: number;
  error: string[];
}

/** Login */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string[];
  token: string;
}

/** Validate */
export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  status: number;
  error: string[];
  userId: string;
}

/** FindUserById */
export interface FindUserByIdRequest {
  userId: string;
}

export interface FindUserByIdResponse {
  status: number;
  error: string[];
  user: User | undefined;
}

/** UpdateUserRole */
export interface UpdateUserRoleRequest {
  roles: Role[];
  userId: string;
}

export interface UpdateUserRoleResponse {
  status: number;
  error: string[];
}

/** Skill */
export interface SkillRequest {
  skillId: string;
}

export interface SkillResponse {
  status: number;
  error: string[];
}

export const AUTH_PACKAGE_NAME = 'auth';

/** Service */

export interface AuthServiceClient {
  /** Pure Authentication */

  register(request: RegisterRequest): Observable<RegisterResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  validate(request: ValidateRequest): Observable<ValidateResponse>;

  /** User Management */

  findUserById(request: FindUserByIdRequest): Observable<FindUserByIdResponse>;

  updateUserRole(request: UpdateUserRoleRequest): Observable<UpdateUserRoleResponse>;

  /** Skill Management */

  skill(request: SkillRequest): Observable<SkillResponse>;
}

/** Service */

export interface AuthServiceController {
  /** Pure Authentication */

  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;

  /** User Management */

  findUserById(
    request: FindUserByIdRequest,
  ): Promise<FindUserByIdResponse> | Observable<FindUserByIdResponse> | FindUserByIdResponse;

  updateUserRole(
    request: UpdateUserRoleRequest,
  ): Promise<UpdateUserRoleResponse> | Observable<UpdateUserRoleResponse> | UpdateUserRoleResponse;

  /** Skill Management */

  skill(request: SkillRequest): Promise<SkillResponse> | Observable<SkillResponse> | SkillResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['register', 'login', 'validate', 'findUserById', 'updateUserRole', 'skill'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
