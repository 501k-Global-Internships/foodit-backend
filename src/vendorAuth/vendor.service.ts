import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { JwtHandler } from 'src/userAuth/jwt.service';
import { JwtPayload, StatusType, Tokens } from 'src/shared/constants';
import * as crypto from 'crypto';
import { LoginDto } from 'src/userAuth/dto/login/login.dto';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto } from 'src/userAuth/dto/forgotPassword/forgetPassword.dto';
import { ResetPasswordDto } from 'src/userAuth/dto/resetPassword/resetPassword.dto';
import { UpdateVendorDto } from 'src/vendor/dto/update-vendor.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateLocationDto } from 'src/vendor/dto/updateLocation.dto';

@Injectable()
export class VendorService {
  logger: Logger;
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    console.log( payload )
    // Generate Tokens
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);
      console.log( accessToken, refreshToken )
    await this.updateRefreshToken(payload.sub, refreshToken);

    return { vendor, accessToken, refreshToken };
     } catch (error) {
    console.error('Error during login:', error);
    throw new InternalServerErrorException('Login failed');
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

  async updateVendor(id: number, updateDetails: UpdateVendorDto) {
    try {
      await this.vendorRepository.update({ id }, updateDetails);
      return 'Profile updated successfully!';
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
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

    if (vendor.status === StatusType.PENDING)
      throw new UnauthorizedException(
        'Account not activated, kindly check your mail for activation link',
      );

    if (vendor.status === StatusType.INACTIVE)
      throw new UnauthorizedException(
        'Account deactivated, kindly reach out to admin to activate your account',
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
Password Recovery Method
========================================
*/

  forgotPassowrd = async (details: ForgotPasswordDto): Promise<string> => {
    const { email } = details;
    const vendor = await this.vendorRepository.findOneBy({ email });
    if (!vendor)
      throw new BadRequestException(
        'Reset instruction will be sent to only valid email!',
      );
    // Generate Reset Password Token
    const resetToken = await this.jwtService.generateResetToken(email);
    // Hash token and send to resetPassword token field
    const hashedToken = await this.helperService.hashData(resetToken);
    vendor.resetPasswordToken = hashedToken;

    try {
      await this.vendorRepository.save(vendor);
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }

    this.emailService.sendPasswordRecoveryEmail({
      email,
      name: vendor.businessName,
      resetToken,
    });
    return 'Password recovery link has been sent your your email, Kindly check your mail';
  };

  /* 
=======================================
Password Reset Method
========================================
*/
  async resetPassword(resetData: ResetPasswordDto) {
    const { resetToken, newPassword, confirmPassword } = resetData;
    //Compare passwords
    if (newPassword !== confirmPassword)
      //Do the validation is DTO
      throw new BadRequestException('Password must be the same');
    //Verify Token
    const payload = await this.jwtService.verifyToken(resetToken);
    const vendor = await this.vendorRepository.findOneBy({
      email: payload.sub,
    });
    if (
      !vendor &&
      (await bcrypt.compare(resetToken, vendor.resetPasswordToken))
    ) {
      throw new BadRequestException('Invalid Reset Password Token!!!');
    }

    try {
      vendor.password = newPassword;
      vendor.resetPasswordToken = null;
      this.vendorRepository.save(vendor);
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
    return 'Your Password has been reset successfully, Kindly login with your new password';
  }

  async deactivateVendor(id: number) {
    await this.vendorRepository.update({ id }, { status: StatusType.INACTIVE });
    return 'Profile deactivated successfully!';
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
    const vendor = await this.vendorRepository.findOneBy({ id: payload.sub });

    if (vendor && (await bcrypt.compare(refreshToken, vendor.refreshToken))) {
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

 /*
=======================================
Update Vendor Location
========================================
*/
  async  updateLocation( id: number, updateLocationDto: UpdateLocationDto): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOneBy({ id });
    console.log(vendor);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
      vendor.lat = updateLocationDto.lat;
      vendor.lng = updateLocationDto.lng;
        
      return this.vendorRepository.save(vendor);
  }

 /*
=====================================================================
Haversine formula to calculate distance between two coordinates
=====================================================================
*/
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
     Math.cos(lat1 * (Math.PI / 180)) *
     Math.cos(lat2 * (Math.PI / 180)) *
     Math.sin(dLng / 2) *
     Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  async findNearbyVendors(id: number, radius: number): Promise<Vendor[]> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User Location: Lat ${user.lat}, Lng ${user.lng}`);

    const vendors = await this.vendorRepository.find();
    this.logger.log(`Found ${vendors.length} vendors`);

    const nearbyVendors = vendors.filter((vendor) => {
      const distance = this.calculateDistance(user.lat, user.lng, vendor.lat, vendor.lng);
      this.logger.log(
        `Vendor ID: ${vendor.id}, Distance: ${distance}, Within Radius: ${distance <= radius}`
      );
      return distance <= radius;
    });

    this.logger.log(`Nearby Vendors Count: ${nearbyVendors.length}`);

    return nearbyVendors;
  }
}
