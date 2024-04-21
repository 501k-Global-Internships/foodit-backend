import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class VendorSignupDto {
    @MinLength(3)
    businessname: string;
  
    @IsEmail()
    businessemail: string;
  
    @IsStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    password: string;
  }
  
