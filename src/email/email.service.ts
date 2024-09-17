import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordRecoveryData } from 'src/shared/constants';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly config: ConfigService,
  ) {}

  /* 
=======================================
Send Welcome Email
========================================
*/
  async sendUserWelcomeEmail(user: User, token: string) {
    const confirmationUrl = `https://foodit-cpig.onrender.com/auth/confrim?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      from: this.config.get<string>('USER_GMAIL'), // override default from,
      subject: 'Welcome to FoodIt! Confirm your Email',
      template: './welcome', // `.ejs` extension is appended automatically
      context: {
<<<<<<< HEAD
        name: user.firstname,
=======
        name: user.firstName,
>>>>>>> 238db1ea23fd6a5ac1bcca69676062243c81f99b
        confirmationUrl,
      },
    });
  }

  async sendAccountActivationCode(vendor: Vendor, confirmationCode: string) {
    const confirmationUrl = `https://foodit-cpig.onrender.com/auth/vendor/account_activation/${confirmationCode}`;

    await this.mailService.sendMail({
      to: vendor.email,
      from: this.config.get<string>('USER_GMAIL'), // override default from,
      subject: 'ACCOUNT ACTIVATION',
      template: './accountActivation', // `.ejs` extension is appended automatically
      context: {
        name: vendor.businessName,
        confirmationUrl,
      },
    });
  }

  async sendAccountSuccessEmail(email: string, businessName: string) {
    await this.mailService.sendMail({
      to: email,
      from: this.config.get<string>('USER_GMAIL'), // override default from,
      subject: 'ACCOUNT ACTIVATION SUCCESSFUL',
      template: './accountActivationSuccess', // `.ejs` extension is appended automatically
      context: {
        name: businessName,
      },
    });
  }

  async validationMail(vendor: Vendor, token: string) {
    const confirmationUrl = `exmaple.com/auth/confirm?token=${token}`;

    await this.mailService.sendMail({
      to: vendor.email,
      from: this.config.get<string>('USER_GMAIL'), // override default from,
      subject: 'Welcome to FoodIt! Confirm your Email',
      template: './welcome', // `.ejs` extension is appended automatically
      context: {
        name: vendor.businessAddress,
        confirmationUrl,
      },
    });
  }

  async sendPasswordRecoveryEmail(data: PasswordRecoveryData) {
    const { email, name, resetToken } = data;
    const resetPasswordUrl = `exmaple.com/auth/confrim?token=${resetToken}`;

    await this.mailService.sendMail({
      to: email,
      from: this.config.get<string>('USER_GMAIL'), // override default from,
      subject: 'Password Recovery Assistance!',
      template: './forgotPassword', // `.ejs` extension is appended automatically
      context: {
        name: name,
        resetPasswordUrl,
      },
    });
  }
}
