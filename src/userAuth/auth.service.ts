import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dto/signup.dto';
import { EmailService } from 'src/email/email.service';
import { JwtPayload, Tokens } from 'src/shared/constants/typeDef.dto';
import { ResetPasswordDto } from './dto/resetPassword/resetPassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword/forgetPassword.dto';
import { ForgotPasswordRO } from './dto/forgotPassword/adapter.dto';
import { JwtHandler } from './jwt.service';
import { UserRO } from './dto/login/adapter.dto';
import { HelperService } from 'src/shared/helper.service';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';
import { UpdateLocationDto } from './dto/updateLocation.dto';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    // Inject TypeORM repository into the service class to enable interaction with the database
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // // Inject JTWService
    private readonly jwtService: JwtHandler,
    // Inject EmailService
    private readonly emailService: EmailService,
    private readonly helperService: HelperService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /* 
=======================================
User Registration Method
========================================
*/
  async createUser(userDetails: CreateUserDto): Promise<UserRO> {
    let savedUser: User;
    try {
      // Create a new user entity
      const newUser = this.userRepository.create(userDetails);
      //Save the new user to database
      savedUser = await this.userRepository.save(newUser);
    } catch (error: any) {
      throw new DatabaseExceptionFilter(error);
    }
    // Generate JWT token payload
    const payload = { sub: savedUser.id, email: savedUser.email };
    // Generate Tokens
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);
    await this.updateRefreshToken(payload.sub, refreshToken);

    // Send Welcome Email
    await this.emailService.sendUserWelcomeEmail(savedUser, '12345'); // Create a Dto and generate token

    const response = {
      ...savedUser.LoginResponseObject(),
      accessToken,
      refreshToken,
    };

    return new UserRO({
      status: 201,
      message: 'Successful',
      data: response,
    });
  }

  /* 
=======================================
User Login Method
========================================
*/
  async login(loginDetails: LoginDto): Promise<UserRO> {
    const user = await this.findUserByCredentials(loginDetails);
    const payload = { sub: user.id, email: user.email };
    // Generate Tokens
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);
    await this.updateRefreshToken(payload.sub, refreshToken);
    const response = {
      ...user.LoginResponseObject(),
      accessToken,
      refreshToken,
    };

    return new UserRO({
      status: 200,
      message: 'Successful',
      data: response,
    });
  }

  /* 
=======================================
User LogOut Method
========================================
*/

  async logout(id: number) {
    await this.userRepository.update(id, { refreshToken: null });
  }

  /* 
=======================================
Password Recovery Method
========================================
*/

  forgotPassword = async (
    details: ForgotPasswordDto,
  ): Promise<ForgotPasswordRO> => {
    const { email } = details;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new BadRequestException(
        'Reset instruction will be sent to only valid email!',
      );
    // Generate Reset Password Token
    const resetToken = await this.jwtService.generateResetToken(email);
    // Hash token and send to resetPassword token field
    const hashedToken = await this.helperService.hashData(resetToken);
    user.resetPasswordToken = hashedToken;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }

    this.emailService.sendPasswordRecoveryEmail({
      email,
      name: user.name,
      resetToken,
    });
    return new ForgotPasswordRO({
      status: 200,
      message: 'Successful',
      data: 'Password recovery link has been sent your your email, Kindly check your mail',
    });
  };

  /* 
=======================================
Password Reset Method
========================================
*/
  async resetPassword(resetData: ResetPasswordDto) {
    const { resetToken, newPassword, confirmPassword } = resetData;
    //Compare passwords
    if (newPassword !== confirmPassword)
      throw new BadRequestException('Password must be the same');
    //Verify Token
    const payload = await this.jwtService.verifyToken(resetToken);
    const user = await this.userRepository.findOneBy({ email: payload.sub });
    if (!user && (await bcrypt.compare(resetToken, user.resetPasswordToken))) {
      throw new BadRequestException('Invalid Reset Password Token!!!');
    }

    try {
      user.password = newPassword;
      user.resetPasswordToken = null;
      this.userRepository.save(user);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
    return new ForgotPasswordRO({
      status: 200,
      message: 'Successful',
      data: 'Your Password has been reset successfully, Kindly login with your new password',
    });
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
      const { accessToken, refreshToken } =
        await this.jwtService.generateTokens(payload);
      await this.updateRefreshToken(payload.sub, refreshToken);
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
      throw new NotFoundException('User does not exist!, Kindly signup');
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
    try {
      await this.userRepository.update({ id }, { refreshToken: hashedRt });
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
  }

    /* 
=======================================
Update User Location
========================================
*/
  async  updateLocation( id: number, updateLocationDto: UpdateLocationDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
      user.lat = updateLocationDto.lat;
      user.lng = updateLocationDto.lng;
      
      return this.userRepository.save(user);
  }
}
