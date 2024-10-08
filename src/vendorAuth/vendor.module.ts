import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { AuthModule } from 'src/userAuth/auth.module';
import { JwtHandler } from 'src/userAuth/jwt.service';
import { HelperService } from 'src/shared/helper.service';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, User]), AuthModule],
  controllers: [VendorController],
  providers: [VendorService, JwtHandler, HelperService, EmailService],
  exports: [VendorService],
})
export class VendorAuthModule {}
