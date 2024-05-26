import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * This should be the same email used to sign up
   * @example ismailtijani@gmail.com
   */
  @IsEmail()
  email: string;
}
