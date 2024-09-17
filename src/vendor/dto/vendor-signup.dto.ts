import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class VendorSignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  businessName: string;

  @IsNotEmpty()
  @IsString()
  businessAddress: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  phoneNumber: string;

  @IsNotEmpty()
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
