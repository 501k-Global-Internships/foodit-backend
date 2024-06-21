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
    this.logger = new Logger(JwtHandler.name);
  }

  private SECRET: string = this.config.get<string>('SECRET');
  private RT_SECRET: string = this.config.get<string>('JWT_RT_SECRET');
  private TOKEN_EXPIRATION = this.config.get<string>('TOKEN_EXPIRATION');
  private RT_EXPIRATION = this.config.get<string>('REFRESH_TOKEN_EXPIRATION');

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    try {
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
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
  }

  async generateResetToken(email: string) {
    try {
      const resetToken = await this.jwtService.signAsync(
        { email },
        {
          secret: this.SECRET,
          expiresIn: this.TOKEN_EXPIRATION,
        },
      );
      return resetToken;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, { secret: this.SECRET });
    } catch (error) {
      this.logger.log('error occurred verifying token', error.message);
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired');
      } else {
        throw new BadRequestException('Invalid Token');
      }
    }
  }
}
