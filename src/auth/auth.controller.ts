import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/jwt_rt.guard';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt_at.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** API Endpoint for User Registration */
  @ApiBadRequestResponse()
  @Post('local/signup')
  createUser(@Body() signupDetails: SignupDto) {
    return this.authService.createUser(signupDetails);
  }

  /** API Endpoint to Login User */
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
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user.id);
    return 'You have successfully logout of the system, see you soon!';
  }

  /** API Endpoint to get Refresh Tokens */
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user['refreshToken'], user['payload']);
  }
}
