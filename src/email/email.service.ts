import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  /* 
=======================================
Send Welcome Email
========================================
*/
  async sendUserWelcomeEmail(user: User, token: string) {
    const confirmationUrl = `exmaple.com/auth/confrim?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      from: '"FoodIt" <support@example.com>', // override default from,
      subject: 'Welcome to FoodIt! Confirm your Email',
      template: './welcome', // `.ejs` extension is appended automatically
      context: {
        name: user.name,
        confirmationUrl,
      },
    });
  }
}
