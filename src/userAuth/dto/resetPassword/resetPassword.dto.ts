import { IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  /**
   * This is the new password
   * @example 'Password@123'
   */
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword: string;

  /**
   * This is the confirm a password
   * @example 'Password@123'
   */
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  confirmPassword: string;

  /**
   * This is the password hash
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVrcGF1Y2hlY2hpMUBnbWFpbC5jb20iLCJyZXNldFRva2VuIjoiY2dLZFZ6MUY3NmR5Q21zQXljMzZMIiwiaWF0IjoxNjI4MDk3MTE5LCJleHAiOjE2MzA2ODkxMTl9.UpaQqH2_Nkt028hArhgIDs6lMTpSOEhWQxtB7BYbIcU'
   */
  @IsNotEmpty()
  @IsJWT()
  resetToken: string;
}
