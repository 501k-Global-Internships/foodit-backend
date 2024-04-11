import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/vendor/strategy/jwt_at.strategy';
import { RtStrategy } from 'src/auth/strategies/jwt_rf.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        global: true,
        secret: ConfigService.get<string>('JWT_AT_SECRET'),
        signOptions: { expiresIn: 60 * 15 },
      }),
    }),
  ],
  controllers: [VendorController],
  providers: [VendorService, JwtStrategy, RtStrategy],
  exports: [VendorService],
})
export class VendorModule {}
