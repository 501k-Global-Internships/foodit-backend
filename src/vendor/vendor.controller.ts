import { 
  Body,
  Controller, 
  Delete,
  Get,  
  Req, 
  Patch, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  UseGuards
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt_at.guard';


@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)

export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('me')
  getVendor(@Req() req: Request) {
    return req.user;
  }

  @Patch()
  updateVendor(@Req() req: Request, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.updateVendor(req.user['id'], updateVendorDto);
  }

  @ApiOperation({ description: 'API Endpoint for deactivating vender data' })
  @Delete('deactivate')
  deactivateVendor(@Req() req:Request) {
    return this.vendorService.deactivateVendor(req.user.id);
  }
}
