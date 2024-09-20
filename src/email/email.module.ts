import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { GoogleOAuth2TransportService } from './google-oauth2-transport.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const transportService = new GoogleOAuth2TransportService(
          configService.get('GOOGLE_CLIENT_ID'),
          configService.get('GOOGLE_CLIENT_SECRET'),
          configService.get('GOOGLE_REFRESH_TOKEN'),
          configService.get('GMAIL_USER'),
        );
        return {
          transport: await transportService.createTransport(),
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, GoogleOAuth2TransportService],
  exports: [MailService],
})
export class MailModule {}

// import { Global, Module } from '@nestjs/common';
// import { EmailService } from './email.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
// import { join } from 'path';
// import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

// @Global()
// @Module({
//   imports: [
//     MailerModule.forRootAsync({
//       useFactory: async (config: ConfigService) => ({
//         transport: {
//           host: config.get('MAIL_HOST'),
//           // service: 'gmail',
//           // host: "smtp.gmail.com",
//           port: 465,
//           // port: 587,
//           // secure: false,
//           secure: true,
//           debug: true,
//           logger: true,
//           auth: {
//             // type: "OAuth2",
//             user: config.get('USER_GMAIL'),
//             pass: config.get('USER_PASSWORD'),
//             // clientId: process.env.GOOGLE_CLIENT_ID,
//             // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             // refreshToken: process.env.USER_GMAIL_REFRESH_TOKEN,
//           },
//         },
//         defaults: {
//           from: config.get<string>('USER_GMAIL'),
//         },
//         template: {
//           dir: join(__dirname, 'templates'),
//           adapter: new EjsAdapter(),
//           options: {
//             strict: false,
//           },
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [EmailService],
//   exports: [EmailService],
// })
// export class EmailModule {}
