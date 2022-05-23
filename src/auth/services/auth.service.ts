import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from './jwt.service';

import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto, FindUserByIdRequestDto } from '../dto/auth.dto';

import { User, UserDocument } from '../entities/user.entity';
import { Model } from 'mongoose';
import { Status } from 'src/common/dto/status.enum';

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
  public async register({ email, password }: RegisterRequestDto): Promise<UserDocument> {
    const userExists = await this.authModel.exists({ email });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.authModel.create({
      email,
      password: this.jwtService.encodePassword(password),
    });

    await newUser.save();

    return newUser;
  }

  /**
   * Logs in an User
   * @param param.email The User's email
   * @param param.password The User's passsword
   * @returns The response status, possible errors and the authetication token
   */
  public async login({ email, password }: LoginRequestDto): Promise<string> {
    const user = await this.authModel.findOne({ email });

    // If the user status is DELETED, treat it as if not found
    if (!user || user.status === Status.DELETED) {
      throw new NotFoundException('User not found');
    }

    // If the user status is not ACTIVE, abort.
    if (user.status !== Status.ACTIVE) {
      throw new ForbiddenException('User not active');
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong password');
    }

    const token: string = this.jwtService.generateToken(user);

    await user.updateLastLogin();

    return token;
  }

  /**
   * Validates a logged in User
   * @param param.token The authorization token
   * @returns The response status, possible errors and the user id
   */
  public async validate({ token }: ValidateRequestDto): Promise<UserDocument> {
    const decoded = await this.jwtService.verify(token);

    if (!decoded) {
      throw new ForbiddenException('Invalid token');
    }

    const user = await this.jwtService.validateUser(decoded);

    if (!user || user.status === Status.DELETED) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== Status.ACTIVE) {
      throw new ForbiddenException('User not active');
    }

    return user;
  }

  /**
   * Finds a user by its id
   * @param param.userId The user id
   * @returns The user document object
   */
  public async findUserById({ userId }: FindUserByIdRequestDto): Promise<UserDocument> {
    const user = await this.authModel.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
