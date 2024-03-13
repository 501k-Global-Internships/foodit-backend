import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from 'src/typeDef.dto';
import { hashData } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    // Inject TypeORM repository into the service class to enable interaction with the database
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // Inject JTWService
    private readonly jwtService: JwtService,
    // Inject Config Service so as to access Environment variable
    private readonly configService: ConfigService,
    // Inject EmailService
    private readonly emailService: EmailService,
  ) {}

  /* 
=======================================
User Registration Method
========================================
*/
  async createUser(userDetails: SignupDto): Promise<Tokens> {
    try {
      // Create a new user entity
      const newUser = this.userRepository.create(userDetails);
      //Save the new user to database
      const savedUser = await this.userRepository.save(newUser);
      // Generate JWT token payload
      const payload = { sub: savedUser.id, email: savedUser.email };
      // Generate Tokens
      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      // Send Welcome Email
      this.emailService.sendUserWelcomeEmail(savedUser, '12345'); // Create a Dto and generate token
      // Return Tokens
      return { accessToken, refreshToken };
    } catch (error: any) {
      return error.sqlMessage;
    }
  }

  /* 
=======================================
User Login Method
========================================
*/
  async login(loginDetails: LoginDto): Promise<Tokens> {
    const payload = await this.findByCredentials(loginDetails);
    // Generate Tokens
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    // Return Tokens
    return { accessToken, refreshToken };
  }

  /* 
=======================================
User LogOut Method
========================================
*/

  logout = async (id: number) =>
    await this.userRepository.update(id, { refreshToken: null });

  /* 
=======================================
Refresh Token Method
========================================
*/
  async refreshToken(
    refreshToken: string,
    payload: JwtPayload,
  ): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (user && (await bcrypt.compare(refreshToken, user.refreshToken))) {
      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    }
    throw new ForbiddenException('Access Denied!!!');
  }

  /* 
=======================================
Find User by credentials
========================================
*/
  async findByCredentials({ email, password }: LoginDto): Promise<JwtPayload> {
    // Find User by email
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new BadRequestException('User does not exist!, Kindly signup');
    // Validate password
    if (await bcrypt.compare(password, user.password)) {
      const payload = { sub: user.id, email: user.email };
      return payload;
    } else {
      // Throw UnauthorizedException if login credentials are incorrect
      throw new BadRequestException(
        'Invalid Email or Password, Please check your login credentials',
      );
    }
  }

  /* 
================================================
Generate Tokens (AccessToken and RefreshToken)
================================================
*/
  generateAccessToken = (payload: JwtPayload) =>
    this.jwtService.signAsync(payload);

  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRATION'),
      secret: this.configService.get<string>('JWT_RT_SECRET'),
    });
    // Hash refreshToken and store in the database
    const hashedRt = await hashData(refreshToken);
    await this.userRepository.update(
      { id: payload.sub },
      { refreshToken: hashedRt },
    );
    return refreshToken;
  }
}
