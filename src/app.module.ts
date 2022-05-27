import { Logger, Module, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';

import { ConfigInterface, loader, validationSchema } from './config';

import { AuthModule } from 'src/auth/auth.module';
import { SkillModule } from 'src/skill/skill.module';

import { AuthService } from 'src/auth/services/auth.service';
import { Role } from 'src/auth/entities/role.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loader],
      validationSchema: validationSchema,
      expandVariables: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigInterface>) => ({
        uri: configService.get('DB_URI', { infer: true }),
        autoIndex: true,
      }),
    }),
    AuthModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<ConfigInterface>,
    private readonly logger: Logger,
  ) {}

  private _isSeedEnabled() {
    return this.configService.get('SEED_ENABLED', { infer: true });
  }

  private _getSudoUserCredentials() {
    return {
      email: this.configService.get('SUDO_USER_EMAIL', { infer: true }),
      password: this.configService.get('SUDO_USER_PASSWORD', { infer: true }),
    };
  }

  private async _shouldSeedSudoUser() {
    try {
      const { email } = this._getSudoUserCredentials();
      await this.authService.findUserByEmail({ email });

      return false;
    } catch (err) {
      if (err instanceof NotFoundException) {
        return true;
      }
    }
  }

  async onApplicationBootstrap() {
    const LOGER_CONTEXT = 'AppModuleBootstrap';

    this.logger.log('Starting seed process', LOGER_CONTEXT);

    if (!this._isSeedEnabled()) {
      this.logger.log('Seed NOT enabled. Aborting...', LOGER_CONTEXT);
      return;
    }
    if (!(await this._shouldSeedSudoUser())) {
      this.logger.log('Database already seeded. Aborting...', LOGER_CONTEXT);
      return;
    }

    // Register User
    const sudoUser = await this.authService.register(this._getSudoUserCredentials());

    // Add Sudo And Remove User Role
    await this.authService.addRoleToUser({ userId: sudoUser._id, role: Role.SUDO });
    await this.authService.removeRoleFromUser({ userId: sudoUser._id, role: Role.USER });

    // Activate User
    await this.authService.activateUserById({ userId: sudoUser._id });

    this.logger.log(`Seed process successfully concluded. Sudo user id: ${sudoUser._id}`, LOGER_CONTEXT);
  }
}
