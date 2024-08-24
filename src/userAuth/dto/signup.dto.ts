import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
  /** @example Ismail */
  @MinLength(3)
  firstName: string;

  /** @example SOT */
  @MinLength(3)
  lastName: string;

  /** @example example@gmail.com */
  @IsEmail()
  email: string;

  /** @example Password@123 */
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    },
  )
  password: string;
}
