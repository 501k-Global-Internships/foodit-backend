import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VendorAuthGuard extends AuthGuard('vendor_jwt_guard') {}
