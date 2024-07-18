import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './userAuth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Vendor } from './vendorAuth/entities/vendor.entity';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error-filter';
import { VendorAuthModule } from './vendorAuth/vendor.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './env/.prod.env',
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './env/.prod.env'
          : './env/.dev.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Vendor],
         synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    AdminModule,
    EmailModule,
    VendorModule,
    VendorAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpErrorFilter }],
})
export class AppModule {}
