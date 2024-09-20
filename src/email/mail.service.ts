import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    const confirmationUrl = `https://yourapp.com/reset-password?token=`;
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Our Platform!',
      template: './welcome',
      context: {
        name,
        confirmationUrl,
      },
    });
  }

  async sendForgotPasswordMail(to: string, resetToken: string) {
    const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Password Reset Request',
      template: './forgot-password',
      context: {
        resetLink,
      },
    });
  }
}
