import { Module } from '@nestjs/common';
import { AuthService } from './userAuth/auth.service';
import { AuthController } from './userAuth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt_at.strategy';
import { RtStrategy } from './strategies/jwt_rt.strategy';
import { UserModule } from 'src/user/user.module';
// import { HelperService } from 'src/shared/constants/helper.service';
import { JwtHandler } from './jwt.service';
import { HelperService } from 'src/shared/helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        global: true,
        secret: ConfigService.get<string>('JWT_AT_SECRET'),
        signOptions: { expiresIn: 60 * 15 },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RtStrategy, HelperService, JwtHandler],
})
export class AuthModule {}
