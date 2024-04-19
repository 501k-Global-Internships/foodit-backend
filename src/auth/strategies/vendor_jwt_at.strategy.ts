import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/typeDef.dto';
import { Vendor } from '../../vendor/entities/vendor.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const vendor = await this.vendorRepository.findOneBy({ id: payload.sub });
    if (!vendor) throw new UnauthorizedException('Access Denied!!!');
    return vendor;
  }
}
