import { 
  Body,
  Controller, 
  Delete,
  Get, 
  HttpCode,
  HttpStatus,
  Post, 
  Req, 
  Patch, 
  UseGuards, 
  UseInterceptors, 
  ClassSerializerInterceptor
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt_at.guard';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { RefreshTokenGuard } from 'src/auth/guards/jwt_rt.guard';
import { Request } from 'express';
import { VendorSignupDto } from './dto/vendor-signup.dto';
import { vendorLoginDto } from './dto/vendor-login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Vendor')
@Controller('vendor')
@UseInterceptors(ClassSerializerInterceptor)

export class VendorController {
  constructor(private readonly vendorService: VendorService) {}


  @Get('me')
  getVendor(@Req() req: Request) {
    return req.user;
  }

   @Get('logout')
   @UseGuards(JwtGuard)
   async logout(@Req() req: Request) {
     await this.vendorService.logout(req.user.id);
     return 'You have successfully logout of the system, see you soon!';
   }

  @Patch()
  updateVendor(@Req() req: Request, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.updateVendor(req.user.id, updateVendorDto);
  }

  @ApiOperation({ description: 'API Endpoint for deactivating vender data' })
  @Delete('deactivate')
  deactivateVendor(@Req() req:Request) {
    return this.vendorService.deactivateVendor(req.user.id);
  }

    /** API Endpoint to get Refresh Tokens */
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Req() req: Request) {
    const user = req.user;
    return this.vendorService.refreshToken(user['refreshToken'], user['payload']);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request) {
     return req.user;
  }


  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

   
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: Request) {
     return req.user;
  }
}
