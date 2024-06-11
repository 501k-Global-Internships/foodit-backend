import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';
import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/helper.service';
import { EmailService } from 'src/email/email.service';
import { JwtHandler } from 'src/auth/jwt.service';

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
    try {
      // Create a new user entity
      const newVendor = this.vendorRepository.create(vendorDetails);
      //Save the new user to database
      savedVendor = await this.vendorRepository.save(newVendor);
    } catch (error: any) {
      throw new DatabaseExceptionFilter(error);
    }
    // Generate JWT token payload
    const payload = { sub: savedVendor.id, email: savedVendor.email };
    // Generate Tokens
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);
    await this.updateRefreshToken(payload.sub, refreshToken);

    // Send Welcome Email
    await this.emailService.validationMail(savedVendor, accessToken);

    return 'Validation email sent, kindly check your mail and validate';
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
