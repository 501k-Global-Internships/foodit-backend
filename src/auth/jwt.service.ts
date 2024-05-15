// import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
// import { ConfigService } from '@nestjs/config';
// import { ClientUserEntity } from '../client-user/client-user.entity';

// @Injectable()
// export class JwtService {
//   private readonly logger: Logger;
//   constructor(
//     private readonly configService: ConfigService
//     ) {
//       this.logger = new Logger(JwtService.name);
//     }

//   private SECRET: string = this.configService.get<string>('SECRET');

//   generateAccessToken(email: string) {
//     return jwt.sign({ email }, this.configService.get<string>('SECRET'), {
//       expiresIn: '1h',
//     });
//   }

//   generateSuperAdminAccessToken(email: string) {
//     return jwt.sign(
//       { email, isSuperAdmin: true },
//       this.configService.get<string>('SECRET'),
//       { expiresIn: '1h' },
//     );
//   }

//   generateResetToken(clientUser: ClientUserEntity) {
//     const { email, resetToken } = clientUser;
//     return jwt.sign(
//       { email, resetToken },
//       this.configService.get<string>('SECRET'),
//       { expiresIn: '30d' },
//     );
//   }

//   verifyToken(hash: string) {
//     try {
//       return jwt.verify(hash, this.SECRET);
//     } catch (error) {
//       this.logger.log("error occurred verifing token", error.message);
//       throw new HttpException('Invalid Hash', HttpStatus.BAD_REQUEST);
//     }
//   }
// }
