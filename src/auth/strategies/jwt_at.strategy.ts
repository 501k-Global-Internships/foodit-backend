import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from 'src/typeDef.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) throw new UnauthorizedException('Access Denied!!!');
    return user;
  }
}
