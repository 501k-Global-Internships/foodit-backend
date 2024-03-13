import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  /** @example example@gmail.com */
  @IsEmail()
  email: string;

  /** @example Password@123 */
  @IsString()
  password: string;
}
