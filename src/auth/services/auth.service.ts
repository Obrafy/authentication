import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto, FindUserByIdRequestDto } from '../dto/auth.dto';
import { User, UserDocument } from '../entities/user.entity';
import { FindUserByIdResponse, LoginResponse, RegisterResponse, ValidateResponse } from '../dto/proto/auth.pb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<UserDocument>,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new User
   * @param param.email The User's email
   * @param param.password The User's passsword
   * @returns The response status and possible errors
   */
  public async register({ email, password }: RegisterRequestDto): Promise<RegisterResponse> {
    const userExists = await this.authModel.exists({ email });

    if (userExists) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    const newUser = await this.authModel.create({
      email,
      password: this.jwtService.encodePassword(password),
    });

    await newUser.save();

    return { status: HttpStatus.CREATED, error: null };
  }

  /**
   * Logs in an User
   * @param param.email The User's email
   * @param param.password The User's passsword
   * @returns The response status, possible errors and the authetication token
   */
  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const user = await this.authModel.findOne({ email });

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      return { status: HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
    }

    const token: string = this.jwtService.generateToken(user);

    await user.updateLastLogin();

    return { token, status: HttpStatus.OK, error: null };
  }

  /**
   * Validates a logged in User
   * @param param.token The authorization token
   * @returns The response status, possible errors and the user id
   */
  public async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded = await this.jwtService.verify(token);

    if (!decoded) {
      return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null };
    }

    const auth = await this.jwtService.validateUser(decoded);

    if (!auth) {
      return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }

  public async findUserById({ userId }: FindUserByIdRequestDto): Promise<FindUserByIdResponse> {
    const user = await this.authModel.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return {
      status: HttpStatus.OK,
      error: null,
      user: {
        ...user,
        // Casting dates to integer for gRPC
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
        lastLogin: user.lastLogin.getTime(),
        // Roles is not implemented yet
        roles: [],
      },
    };
  }
}
