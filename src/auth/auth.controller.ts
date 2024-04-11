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
import { vendorLoginDto } from 'src/vendor/dto/vendor-login.dto';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
import { RefreshTokenGuard } from './guards/jwt_rt.guard';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt_at.guard';
import { AuthGuard } from '@nestjs/passport';
import { VendorService } from 'src/vendor/vendor.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly vendorService: VendorService
    ) {}

  /** API Endpoint for User Registration */
  @ApiBadRequestResponse()
  @Post('local/signup')
  createUser(@Body() signupDetails: SignupDto) {
    return this.authService.createUser(signupDetails);
  }

  @Post('vendor/signup')
  createuser(@Body() signupDetails: VendorSignupDto) {
    return this.vendorService.createvendor(signupDetails);
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

  @Post('vendor/login')
  @HttpCode(HttpStatus.OK)
  Login(@Body() loginDetails: vendorLoginDto) {
     return this.vendorService.login(loginDetails);
  } 

  /** API Endpoint to Logout User */
  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['id']);
    return 'You have successfully logout of the system, see you soon!';
  }

  /** API Endpoint to get Refresh Tokens */
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshToken(user['refreshToken'], user['payload']);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}
 
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request) {
     // Handle the user data returned from Facebook
     return req.user;
  }
 
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}
 
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: Request) {
     // Handle the user data returned from Google
     return req.user;
  }
}
