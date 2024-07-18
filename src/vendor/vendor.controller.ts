import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Request } from 'express';
import { VendorAuthGuard } from 'src/userAuth/vendorGuards/vendor_jwt_at.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Vendor')
@Controller('vendor')
@UseInterceptors(ClassSerializerInterceptor)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  @UseGuards(VendorAuthGuard)
  getVendor(@Req() req: Request) {
    return req.user;
  }
}
