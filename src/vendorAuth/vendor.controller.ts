import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VendorSignupDto } from 'src/vendorAuth/dto/vendor-signup.dto';
import { VendorService } from './vendor.service';
import { ConfirmAccountDto } from './dto/confirmAccount.dto';
import { LoginDto } from 'src/userAuth/dto/login/login.dto';
import { Vendor } from './entities/vendor.entity';
import { VendorAuthGuard } from 'src/userAuth/vendorGuards/vendor_jwt_at.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/userAuth/guards/jwt_rt.guard';
import { ForgotPasswordDto } from 'src/userAuth/dto/forgotPassword/forgetPassword.dto';
import { ResetPasswordDto } from 'src/userAuth/dto/resetPassword/resetPassword.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';

@ApiTags('Auth')
@Controller('auth/vendor')
//Removing sensitive through serialization
@UseInterceptors(ClassSerializerInterceptor)
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

  @Get('account_activation/:confirmationCode')
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
  @UseGuards(VendorAuthGuard)
  async Logout(@Req() req: Request) {
    return this.vendorService.logout(req.user['id']);
  }

  @Patch()
  @UseGuards(VendorAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateVendor(@Req() req: Request, @Body() updateDetails: UpdateVendorDto) {
    return this.vendorService.updateVendor(req.user['id'], updateDetails);
  }
  
  /**API Endpoint to Update User Location */
  @Post('location/update')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto
  ): Promise<Vendor> {
    return this.vendorService.updateLocation(id, updateLocationDto);
  }

  @Get('nearby/:id')
  @UseGuards(VendorAuthGuard)
  @ApiOperation({ description: 'Get vendors nearby based on user location' })
  async getNearbyVendors(@Param('id') id: number, @Query('radius') radius: number): Promise<Vendor[]> {
    return this.vendorService.findNearbyVendors(id, radius);
  }

  /**
   * This endpoint is  called when a vendor forgots his/her password
   * @param forgotPasswordData
   */
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() forgotPasswordData: ForgotPasswordDto,
  ): Promise<string> {
    return this.vendorService.forgotPassowrd(forgotPasswordData);
  }

  /**
   * This endpoint is called when a vendor wants to reset his/her password
   * @param resetData
   */
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetData: ResetPasswordDto): Promise<string> {
    return this.vendorService.resetPassword(resetData);
  }

  /**
   * It finds and deactivate Vendor matching the given ID.
   *  If it cannot find it, it returns an error
   */
  @Delete()
  @UseGuards(VendorAuthGuard)
  @ApiOperation({ description: 'API Endpoint for deactivating Vendor data' })
  @HttpCode(HttpStatus.OK)
  deactivateUser(@Req() req: Request) {
    return this.vendorService.deactivateVendor(req.user['id']);
  }

  /** API Endpoint to get Refresh Tokens */
  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    const vendor = req.user;
    return this.vendorService.refreshToken(
      vendor['refreshToken'],
      vendor['payload'],
    );
  }
}
