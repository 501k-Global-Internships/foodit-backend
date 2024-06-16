import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VendorGuard extends AuthGuard('vendor_jwt_guard') {}
