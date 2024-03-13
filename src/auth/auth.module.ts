import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt_at.strategy';
import { RtStrategy } from './strategies/jwt_rf.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        global: true,
        secret: ConfigService.get<string>('JWT_AT_SECRET'),
        signOptions: { expiresIn: 60 * 15 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RtStrategy],
})
export class AuthModule {}
