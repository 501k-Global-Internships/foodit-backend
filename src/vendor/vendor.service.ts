import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorSignupDto } from './dto/vendor-signup.dto';
import { vendorLoginDto } from './dto/vendor-login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from 'src/typeDef.dto';
import { JwtService } from '@nestjs/jwt';
import { hashData } from 'src/utils/utils';


@Injectable()
export class VendorService {

  // Inject TypeORM repository into the service class to enable interaction with the database
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}
  
  async createvendor(signUpDto: VendorSignupDto): Promise<Tokens> {
    try {
      // Create a new vendor entity
      const newVendor = this.vendorRepository.create(signUpDto);
      //Save the new vendor to database
      const savedVendor = await this.vendorRepository.save(newVendor);
      //Generate JWT token payload
      const payload = { sub: savedVendor.id, email: savedVendor.businessemail };
      // Generate Tokens
      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      // Send Welcome Email
      this.emailService.sendVendorWelcomeEmail(savedVendor, '12345'); // Create a Dto and generate token
      // Return Saved vendor
      return { accessToken, refreshToken};
    } catch (error: any) {
      return error.sqlMessage;
    }
}  

  async login(loginDto: vendorLoginDto): Promise<Tokens> {
    const payload = await this.findByCredentials(loginDto);
    // Generate Tokens
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    // Return Tokens
    return { accessToken, refreshToken };
  }
  //   const vendor = await this.vendorRepository.findOne({ where: { businessemail: loginDto.businessemail }});
  //   if (!vendor) {
  //     throw new Error('Vendor not found');
  //   }
  //   const isPasswordValid = await bcrypt.compare(loginDto.password, vendor.password);
  //   if (!isPasswordValid) {
  //     throw new Error('Invalid password');
  //   }
  //   return vendor;
  // }

  async updateVendor(id: number, updateDetails: UpdateVendorDto) {
    await this.vendorRepository.update({ id }, { ...updateDetails });
    return 'Profile updated successfully!';
  }

  async deactivateVendor(id: number) {
    await this.vendorRepository.delete({ id });
    return 'Profile deactivated successfully!';
  }

    /* 
=======================================
Vendor LogOut Method
========================================
*/

  logout = async (id: number) =>
  await this.vendorRepository.update(id, { refreshToken: null });

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
      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    }
    throw new ForbiddenException('Access Denied!!!');
  }


  generateAccessToken = (payload: JwtPayload) =>
  this.jwtService.signAsync(payload);

  async generateRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRATION'),
      secret: this.configService.get<string>('JWT_RT_SECRET'),
    });
    // Hash refreshToken and store in the database
    const hashedRt = await hashData(refreshToken);
    await this.vendorRepository.update(
      { id: payload.sub },
      { refreshToken: hashedRt },
    );
    return refreshToken;
  }


  async findByCredentials({ businessemail, password }: vendorLoginDto): Promise<JwtPayload> {
    // Find Vendor by email
    const user = await this.vendorRepository.findOneBy({ businessemail });
    if (!user)
      throw new BadRequestException('Vendor does not exist!, Kindly signup');
    // Validate password
    if (await bcrypt.compare(password, user.password)) {
      const payload = { sub: user.id, email: user.businessemail };
      return payload;
    } else {
      // Throw UnauthorizedException if login credentials are incorrect
      throw new BadRequestException(
        'Invalid Email or Password, Please check your login credentials',
      );
    }
  }
}
