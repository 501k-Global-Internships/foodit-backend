import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** @example example@footit.com */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** @example Password@123 */
  @IsString()
  @IsNotEmpty()
  password: string;
}
