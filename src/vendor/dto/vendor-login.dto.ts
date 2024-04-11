import { IsEmail, IsString } from 'class-validator';

export class vendorLoginDto {
  /** @example example@gmail.com */
  @IsEmail()
  businessemail: string;

  /** @example Password@123 */
  @IsString()
  password: string;
}
