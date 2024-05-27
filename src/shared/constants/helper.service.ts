import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HelperService {
  private readonly PASSWORD_LENGHT: number;
  private readonly SECRET: string;

  constructor(private readonly config: ConfigService) {
    this.PASSWORD_LENGHT = 8;
    this.SECRET = this.config.get('JWT_SECRET');
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
