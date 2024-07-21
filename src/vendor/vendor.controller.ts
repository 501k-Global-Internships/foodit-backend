import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorAuthGuard } from 'src/userAuth/vendorGuards/vendor_jwt_at.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(VendorAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  /** API Endpoint for retrieving user information. */
  @Get(':id')
  getVendor(@Param('id') id: number) {
    return this.vendorService.getVendor(id);
  }
}
