import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from '../entities/auth.entity';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dev',
      ignoreExpiration: true,
    });
  }

  private validate(token: UserDocument): Promise<User | never> {
    return this.jwtService.validateUser(token);
  }
}
