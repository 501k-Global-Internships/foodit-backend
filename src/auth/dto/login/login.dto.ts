import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  /** @example example@footit.com */
  @IsEmail()
  email: string;

  /** @example Password@123 */
  @IsString()
  password: string;
}
