import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login/login.dto';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt_at.guard';
import { ForgotPasswordDto } from './dto/forgotPassword/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword/resetPassword.dto';
import { ForgotPasswordRO } from './dto/forgotPassword/adapter.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/jwt_rt.guard';

@ApiTags('Auth')
@Controller('auth')
//Removing sensitive through serialization
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** API Endpoint for User Registration */
  @ApiBadRequestResponse()
  @Post('local/signup')
  createUser(@Body() signupDetails: CreateUserDto) {
    return this.authService.createUser(signupDetails);
  }

  /**
   * This endpoint logs the user in
   * a 401 error is thrown if endpoint doesn't exist
   * @param loginDetails
   */
  @ApiUnauthorizedResponse({
    description:
      'Invalid Email or Password, Please check your login credentials',
  })
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDetails: LoginDto) {
    return this.authService.login(loginDetails);
  }

  /** API Endpoint to Logout User */
  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['id']);
    return 'You have successfully logout of the system, see you soon!';
  }

  /**
   * This endpoint is  called when a user forgots his/her password
   * @param forgotPasswordData
   */
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() forgotPasswordData: ForgotPasswordDto,
  ): Promise<ForgotPasswordRO> {
    return this.authService.forgotPassowrd(forgotPasswordData);
  }

  /**
   * This endpoint is called when a user wants to reset his/her password
   * @param resetData
   */
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body() resetData: ResetPasswordDto,
  ): Promise<ForgotPasswordRO> {
    return this.authService.resetPassword(resetData);
  }

  /** API Endpoint to get Refresh Tokens */
  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user['refreshToken'], user['payload']);
  }
}
