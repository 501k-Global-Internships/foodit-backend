import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class SignupDto {
  /** @example 'Ismail Tijani' */
  @MinLength(3)
  name: string;

  /** @example example@gmail.com */
  @IsEmail()
  email: string;

  /** @example Password@123 */
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
