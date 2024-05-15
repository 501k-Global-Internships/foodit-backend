import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './typeDef.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HelperService {
  private readonly PASSWORD_LENGHT: number;
  private readonly SECRET: string;

  constructor(
    // Inject TypeORM repository into the service class to enable interaction with the database
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // Inject JTWService
    private readonly jwtService: JwtService,
    // Inject Config Service so as to access Environment variable
    private readonly config: ConfigService,
  ) {
    this.PASSWORD_LENGHT = 8;
    this.SECRET = this.config.get('JWT_SECRET');
  }

  hashData = (data: string) => bcrypt.hash(data, 10);

  generateAccessToken = (payload: JwtPayload) =>
    this.jwtService.signAsync(payload);

  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.config.get<number>('REFRESH_TOKEN_EXPIRATION'),
      secret: this.config.get<string>('JWT_RT_SECRET'),
    });
    // Hash refreshToken and store in the database
    const hashedRt = await this.hashData(refreshToken);
    await this.userRepository.update(
      { id: payload.sub },
      { refreshToken: hashedRt },
    );
    return refreshToken;
  }
}
