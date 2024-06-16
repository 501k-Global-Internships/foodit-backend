import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';
import { VendorSignupDto } from 'src/vendor/dto/vendor-signup.dto';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/helper.service';
import { EmailService } from 'src/email/email.service';
import { JwtHandler } from 'src/auth/jwt.service';
import { StatusType, Tokens } from 'src/shared/constants';
import crypto from 'crypto';
import { LoginDto } from 'src/auth/dto/login/login.dto';
import * as bcrypt from 'bcrypt';

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
  /* 
=======================================
Vendor Registration Method
========================================
*/
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

    // Send Confirmation mail to new Vendor
    await this.emailService.sendAccountActivationCode(
      savedVendor,
      confirmationCode,
    );

    return 'Activation email sent, kindly check your mail and activate your account';
  }

  /* 
=======================================
Account Confirmation Method
========================================
*/
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

  /* 
=======================================
Vendor Login Method
========================================
*/
  async login(loginDetails: LoginDto) {
    const vendor = await this.findVendorByCredentials(loginDetails);
    // Generate JWT token payload
    const payload = { sub: vendor.id, email: vendor.email };
    // Generate Tokens
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);
    await this.updateRefreshToken(payload.sub, refreshToken);

    return { vendor, accessToken, refreshToken };
  }

  /* 
=======================================
Vendor Logout Method
========================================
*/

  async logout(id: number): Promise<string> {
    await this.vendorRepository.update(id, { refreshToken: null });
    return 'You have successfully logout of the system, see you soon!';
  }

  /* 
=======================================
find Vendor By Credentials Method
========================================
*/
  async findVendorByCredentials({
    email,
    password,
  }: LoginDto): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOneBy({ email });

    if (!vendor)
      throw new NotFoundException(
        'No Account with this credentials!, Kindly signup',
      );

    if (vendor && vendor.status === StatusType.PENDING)
      throw new UnauthorizedException(
        'Account not activated, kindly check your mail for activation link',
      );

    // Validate password
    if (await bcrypt.compare(password, vendor.password)) {
      return vendor;
    } else {
      throw new BadRequestException(
        'Invalid Email or Password, Please check your login credentials',
      );
    }
  }

  /* 
=======================================
Refresh Token Method
========================================
*/
  async refreshToken(
    refreshToken: string,
    payload: JwtPayload,
  ): Promise<Tokens> {
    const user = await this.vendorRepository.findOneBy({ id: payload.sub });

    if (user && (await bcrypt.compare(refreshToken, user.refreshToken))) {
      const { accessToken, refreshToken } =
        await this.jwtService.generateTokens(payload);
      await this.updateRefreshToken(payload.sub, refreshToken);
      return { accessToken, refreshToken };
    }
    throw new ForbiddenException('Access Denied!!!');
  }

  /* 
=======================================
Update Refresh Token Method
========================================
*/
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
