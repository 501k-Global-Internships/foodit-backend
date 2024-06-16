import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
import { VendorService } from './vendor.service';
import { ConfirmAccountDto } from './dto/confirmAccount.dto';
import { LoginDto } from 'src/auth/dto/login/login.dto';
import { VendorGuard } from 'src/auth/vendorGuards/vendor_jwt_at.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/auth/guards/jwt_rt.guard';
// import { RefreshTokenGuard } from '../guards/jwt_rt.guard';
// import { Request } from 'express';
// import { JwtGuard } from '../guards/jwt_at.guard';

@ApiTags('Auth')
@Controller('auth/vendor')
export class VendorController {
  logger: Logger;
  constructor(private readonly vendorService: VendorService) {
    this.logger = new Logger(VendorController.name);
  }

  /** API Endpoint for Vendor Registration */
  @ApiBadRequestResponse()
  @Post('signup')
  createVendor(@Body() signupDetails: VendorSignupDto) {
    return this.vendorService.createVendor(signupDetails);
  }

  @Get('account_activation')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() paramData: ConfirmAccountDto) {
    const { confirmationCode } = paramData;
    return this.vendorService.confirmAccount(confirmationCode);
  }

  /** API Endpoint to Login Vendor */
  @ApiUnauthorizedResponse({
    description:
      'Invalid Email or Password, Please check your login credentials',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  Login(@Body() loginDetails: LoginDto) {
    return this.vendorService.login(loginDetails);
  }

  /** API Endpoint to Logout Vendor */
  @Get('logout')
  @UseGuards(VendorGuard)
  async Logout(@Req() req: Request) {
    return this.vendorService.logout(req.user?.id);
  }

  /** API Endpoint to get Refresh Tokens */
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    const vendor = req.user;
    return this.vendorService.refreshToken(
      vendor['refreshToken'],
      vendor['payload'],
    );
  }
}
