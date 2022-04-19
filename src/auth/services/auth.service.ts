import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto } from '../dto/auth.dto';
import { User, UserDocument } from '../entities/auth.entity';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../dto/proto/auth.pb';
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
    const authObjectExists = await this.authModel.exists({ email });

    if (authObjectExists) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    const newAuthObject = await this.authModel.create({
      email,
      password: this.jwtService.encodePassword(password),
    });

    await newAuthObject.save();

    return { status: HttpStatus.CREATED, error: null };
  }

  /**
   * Logs in an User
   * @param param.email The User's email
   * @param param.password The User's passsword
   * @returns The response status, possible errors and the authetication token
   */
  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const authObject = await this.authModel.findOne({ email });

    if (!authObject) {
      return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, authObject.password);

    if (!isPasswordValid) {
      return { status: HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
    }

    const token: string = this.jwtService.generateToken(authObject);

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

    const auth = await this.jwtService.validateAuthObject(decoded);

    if (!auth) {
      return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded._id };
  }
}
