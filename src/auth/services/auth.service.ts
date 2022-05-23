import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from './jwt.service';

import * as DTO from '../dto/auth.dto';

import { User, UserDocument } from '../entities/user.entity';
import { Model } from 'mongoose';
import { Status } from 'src/common/dto/status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<UserDocument>,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  // Private Methods

  /**
   * Get an user by id
   * @param userId The User's id
   * @returns The response User object
   */
  private async _getUserById(userId: string): Promise<UserDocument> {
    return this.authModel.findOne({ _id: userId, status: { $ne: Status.DELETED } });
  }

  /**
   * Get an user by email
   * @param email The User's email
   * @returns The response User object
   */
  private async _getUserByEmail(email: string): Promise<UserDocument> {
    return this.authModel.findOne({ email, status: { $ne: Status.DELETED } });
  }

  /**
   * Get an active user by id
   * @param userId The User's id
   * @returns The response User object
   */
  private async _getActiveUserById(userId: string): Promise<UserDocument> {
    return this.authModel.findOne({ _id: userId, status: Status.ACTIVE });
  }

  /**
   * Get an active user by email
   * @param email The User's email
   * @returns The response User object
   */
  private async _getActiveUserByEmail(email: string): Promise<UserDocument> {
    return this.authModel.findOne({ email, status: Status.ACTIVE });
  }

  // Public Methods

  /**
   * Registers a new User
   * @param param.email The User's email
   * @param param.password The User's passsword
   * @returns The response status and possible errors
   */
  public async register({ email, password }: DTO.RegisterRequestDto): Promise<UserDocument> {
    const user = await this._getUserByEmail(email);

    if (user) {
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
  public async login({ email, password }: DTO.LoginRequestDto): Promise<string> {
    const user = await this._getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== Status.ACTIVE) {
      throw new NotFoundException('User not active');
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
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
  public async validate({ token }: DTO.ValidateRequestDto): Promise<UserDocument> {
    const decoded = await this.jwtService.verify(token);

    if (!decoded) {
      throw new ForbiddenException('Invalid token');
    }

    const user = await this.jwtService.validateUser(decoded);

    // Since we're using jwtService's validateUSer method here, we're not validating user status, hence the validations below.
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
  public async findUserById({ userId }: DTO.FindUserByIdRequestDto): Promise<UserDocument> {
    const user = await this._getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  /**
   * Activates a user by its id
   * @param param.userId The user id
   */
  public async activateUserById({ userId }: DTO.ActivateUserByIdRequestDto): Promise<void> {
    const user = await this._getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    user.status = Status.ACTIVE;

    await user.save();
  }

  /**
   * Deactivates a user by its id
   * @param param.userId The user id
   */
  public async deactivateUserById({ userId }: DTO.DeactivateUserByIdRequestDto): Promise<void> {
    const user = await this._getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    user.status = Status.INACTIVE;

    await user.save();
  }

  /**
   * Removes a user by its id
   * @param param.userId The user id
   */
  public async removeUserById({ userId }: DTO.RemoveUserByIdRequestDto): Promise<void> {
    const user = await this._getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    user.status = Status.DELETED;

    await user.save();
  }
}
