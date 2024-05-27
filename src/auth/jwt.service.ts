import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from 'src/shared/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHandler {
  private readonly logger: Logger;
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(JwtService.name);
  }

  private SECRET: string = this.config.get<string>('SECRET');
  private RT_SECRET: string = this.config.get<string>('JWT_RT_SECRET');
  private TOKEN_EXPIRATION = this.config.get<number>('TOKEN_EXPIRATION');
  private RT_EXPIRATION = this.config.get<number>('REFRESH_TOKEN_EXPIRATION');

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.SECRET,
        expiresIn: this.TOKEN_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.RT_SECRET,
        expiresIn: this.RT_EXPIRATION,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async generateResetToken(email: string) {
    const resetToken = await this.jwtService.signAsync(
      { email },
      {
        secret: this.SECRET,
        expiresIn: this.TOKEN_EXPIRATION,
      },
    );

    return resetToken;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verifyAsync(token, { secret: this.SECRET });
    } catch (error) {
      this.logger.log('error occurred verifing token', error.message);
      throw new BadRequestException('Invalid Token');
    }
  }
}
