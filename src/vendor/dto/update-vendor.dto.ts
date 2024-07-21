import { PartialType } from '@nestjs/swagger';
import { VendorSignupDto } from './vendor-signup.dto';

export class UpdateVendorDto extends PartialType(VendorSignupDto) {}
