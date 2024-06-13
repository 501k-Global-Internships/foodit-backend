import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';
import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/helper.service';
import { EmailService } from 'src/email/email.service';
import { JwtHandler } from 'src/auth/jwt.service';
import { StatusType } from 'src/shared/constants';
import crypto from 'crypto';

@Injectable()
export class VendorService {
  logger: Logger;
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private jwtService: JwtHandler,
    private helperService: HelperService,
    private emailService: EmailService,
  ) {
    this.logger = new Logger(VendorService.name);
  }

  async createVendor(vendorDetails: VendorSignupDto) {
    let savedVendor: Vendor;
    const confirmationCode = crypto.randomBytes(20).toString('hex');
    try {
      const newVendor = this.vendorRepository.create({
        ...vendorDetails,
        confirmationCode,
      });

      savedVendor = await this.vendorRepository.save(newVendor);
    } catch (error: any) {
      throw new DatabaseExceptionFilter(error);
    }
    // Generate JWT token payload
    // const payload = { sub: savedVendor.id, email: savedVendor.email };
    // // Generate Tokens
    // const { accessToken, refreshToken } =
    //   await this.jwtService.generateTokens(payload);
    // await this.updateRefreshToken(payload.sub, refreshToken);

    // Send Confirmation mail to new Vendor
    await this.emailService.sendAccountActivationCode(
      savedVendor,
      confirmationCode,
    );

    return 'Activation email sent, kindly check your mail and activate your account';
  }

  async confirmAccount(confirmationCode: string) {
    const vendor = await this.vendorRepository.findOneBy({ confirmationCode });
    if (!vendor)
      throw new BadRequestException('Invalid or Expired confirmation code');

    const updateData = {
      status: StatusType.ACTIVATED,
      confirmationCode: null,
    };

    try {
      await this.vendorRepository.update({ confirmationCode }, updateData);
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
    //Send Account confirmation Success mail
    this.emailService.sendAccountSuccessEmail(
      vendor.email,
      vendor.businessName,
    );

    return 'Account Activation was successful, Kindly login';
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    // Hash refreshToken and store in the database
    const hashedRt = await this.helperService.hashData(refreshToken);
    try {
      await this.vendorRepository.update({ id }, { refreshToken: hashedRt });
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
  }
}
