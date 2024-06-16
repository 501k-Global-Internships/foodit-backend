import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { AuthModule } from 'src/userAuth/auth.module';
import { JwtHandler } from 'src/userAuth/jwt.service';
import { HelperService } from 'src/shared/helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor]), AuthModule],
  controllers: [VendorController],
  providers: [VendorService, JwtHandler, HelperService],
  exports: [VendorService],
})
export class VendorModule {}
