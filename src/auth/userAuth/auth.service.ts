import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login/login.dto';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from '../dto/signup.dto';
import { EmailService } from 'src/email/email.service';
// import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from 'src/shared/constants/typeDef.dto';
// import { HelperService } from 'src/shared/constants';
import { ResetPasswordDto } from '../dto/resetPassword/resetPassword.dto';
import { UserLoginRO } from '../dto/login/adapter.dto';
import { HelperService } from 'src/shared/constants/helper.service';
import { ForgotPasswordDto } from '../dto/forgotPassword/forgetPassword.dto';
import { ForgotPasswordRO } from '../dto/forgotPassword/adapter.dto';
import { JwtHandler } from '../jwt.service';

@Injectable()
export class AuthService {
  constructor(
    // Inject TypeORM repository into the service class to enable interaction with the database
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // // Inject JTWService
    private readonly jwtService: JwtHandler,
    // // Inject Config Service so as to access Environment variable
    // private readonly configService: ConfigService,
    // Inject EmailService
    private readonly emailService: EmailService,
    private readonly helperService: HelperService,
  ) {}

  /* 
=======================================
User Registration Method
========================================
*/
  async createUser(userDetails: CreateUserDto): Promise<UserLoginRO> {
    try {
      // Create a new user entity
      const newUser = this.userRepository.create(userDetails);
      //Save the new user to database
      const savedUser = await this.userRepository.save(newUser);
      // Generate JWT token payload
      const payload = { sub: savedUser.id, email: savedUser.email };
      // Generate Tokens
      const { accessToken, refreshToken } =
        await this.jwtService.generateTokens(payload);
      await this.updateRefreshToken(payload.sub, refreshToken);
      // Send Welcome Email
      this.emailService.sendUserWelcomeEmail(savedUser, '12345'); // Create a Dto and generate token
      const response = { ...savedUser, accessToken, refreshToken };

      // return { ...response, accessToken, refreshToken };
      //Change the name to a
      return new UserLoginRO({
        status: 200,
        message: 'Successful',
        data: response,
      });
    } catch (error: any) {
      return error.sqlMessage;
    }
  }

  /* 
=======================================
User Login Method
========================================
*/
  async login(loginDetails: LoginDto): Promise<UserLoginRO> {
    try {
      const user = await this.findUserByCredentials(loginDetails);
      const payload = { sub: user.id, email: user.email };
      // Generate Tokens
      const { accessToken, refreshToken } =
        await this.jwtService.generateTokens(payload);
      await this.updateRefreshToken(payload.sub, refreshToken);
      const response = { ...user, accessToken, refreshToken };

      return new UserLoginRO({
        status: 200,
        message: 'Successful',
        data: response,
      });
    } catch (error) {}
  }

  /* 
=======================================
User LogOut Method
========================================
*/

  logout = async (id: number) =>
    await this.userRepository.update(id, { refreshToken: null });

  //////////////////// Password Recovery Method ///////////////////////

  forgotPassowrd = async (
    details: ForgotPasswordDto,
  ): Promise<ForgotPasswordRO> => {
    try {
      const { email } = details;
      const user = await this.userRepository.findOneBy({ email });
      if (!user)
        throw new BadRequestException(
          'Reset instruction will be sent to valid email!',
        );
      // Generate Reset Password Token
      // const resetToken = this.helperService.generateAccessToken()
      // // Hash token and send to resetPassword token field
      // user.resetPasswordToken =
      // this.emailService.sendPasswordRecoveryEmail(user);
      return new ForgotPasswordRO({
        status: 200,
        message: 'Successful',
        data: 'Password recovery link has been sent your your email, Kindly check your mail',
      });
    } catch (error) {
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  };

  ////////////////////// Password Reset Method ///////////////////////
  async resetPassword(resetData: ResetPasswordDto) {
    return '';
  }

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
      const accessToken = await this.helperService.generateAccessToken(payload);
      const refreshToken = // Implement generating token from a single methos
        await this.helperService.generateRefreshToken(payload);
      // Hash refreshToken and store in the database
      // const hashedRt = await this.helperService.hashData(refreshToken);
      // await this.userRepository.update(
      //   { id: payload.sub },
      //   { refreshToken: hashedRt },
      // );
      return { accessToken, refreshToken };
    }
    throw new ForbiddenException('Access Denied!!!');
  }

  /* 
=======================================
Find User by credentials
========================================
*/
  async findUserByCredentials({ email, password }: LoginDto): Promise<User> {
    // Find User by email
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new BadRequestException('User does not exist!, Kindly signup');
    // Validate password
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new BadRequestException(
        'Invalid Email or Password, Please check your login credentials',
      );
    }
  }

  /* 
=======================================
Update Refresh Token
========================================
*/
  async updateRefreshToken(id: number, refreshToken: string) {
    // Hash refreshToken and store in the database
    const hashedRt = await this.helperService.hashData(refreshToken);
    await this.userRepository.update({ id }, { refreshToken: hashedRt });
  }
  /** 
   * 
  ================================================
  Generate Tokens (AccessToken and RefreshToken)
  ================================================
  */
}
