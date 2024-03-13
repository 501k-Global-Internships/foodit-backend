import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          //   host: config.get('MAIL_HOST'),
          service: 'gmail',
          // host: "smtp.gmail.com",
          // port: 465,
          // port: 587,
          // secure: false,
          secure: false,
          auth: {
            // type: "OAuth2",
            user: config.get('USER_GMAIL'),
            pass: config.get('USER_PASSWORD'),
            // clientId: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // refreshToken: process.env.USER_GMAIL_REFRESH_TOKEN,
          },
        },
        defaults: {
          from: `"FoodIt" <${config.get('USER_GMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
