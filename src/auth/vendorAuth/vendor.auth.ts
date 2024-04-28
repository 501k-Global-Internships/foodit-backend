// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { vendorLoginDto } from 'src/vendor/dto/vendor-login.dto';
// import {
//   ApiBadRequestResponse,
//   ApiTags,
//   ApiUnauthorizedResponse,
// } from '@nestjs/swagger';
// import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
// import { RefreshTokenGuard } from '../guards/jwt_rt.guard';
// import { Request } from 'express';
// import { JwtGuard } from '../guards/jwt_at.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { VendorService } from 'src/vendor/vendor.service';

// @ApiTags('Auth')
// @Controller('auth')
// export class VendorAuth {
//   constructor(private readonly vendorService: VendorService) {}

//   /** API Endpoint for Vendor Registration */
//   @ApiBadRequestResponse()
//   @Post('vendor/signup')
//   createuser(@Body() signupDetails: VendorSignupDto) {
//     return this.vendorService.createvendor(signupDetails);
//   }

//   /** API Endpoint to Login Vendor */
//   @ApiUnauthorizedResponse({
//     description:
//       'Invalid Email or Password, Please check your login credentials',
//   })
//   @Post('vendor/login')
//   @HttpCode(HttpStatus.OK)
//   Login(@Body() loginDetails: vendorLoginDto) {
//     return this.vendorService.login(loginDetails);
//   }

//   /** API Endpoint to Logout Vendor */
//   @Get('vendor/logout')
//   @UseGuards(JwtGuard)
//   async Logout(@Req() req: Request) {
//     await this.vendorService.logout(req.user['id']);
//     return 'You have successfully logout of the system, see you soon!';
//   }

//   /** API Endpoint to get Refresh Tokens */
//   @Get('vendor/refresh')
//   @UseGuards(RefreshTokenGuard)
//   refresh(@Req() req: Request) {
//     const user = req.user;
//     return this.vendorService.refreshToken(
//       user['refreshToken'],
//       user['payload'],
//     );
//   }

//   // @Get('vendor/facebook')
//   // @UseGuards(AuthGuard('facebook'))
//   // async facebookLogin() {}

//   // @Get('vendor/facebook/redirect')
//   // @UseGuards(AuthGuard('facebook'))
//   // async facebookLoginRedirect(@Req() req: Request) {
//   //   // Handle the user data returned from Facebook
//   //   return req.user;
//   // }

//   // @Get(' vendor/google')
//   // @UseGuards(AuthGuard('google'))
//   // async googleLogin() {}

//   // @Get('vendor/google/redirect')
//   // @UseGuards(AuthGuard('google'))
//   // async googleLoginRedirect(@Req() req: Request) {
//   //   // Handle the user data returned from Google
//   //   return req.user;
//   // }
// }
