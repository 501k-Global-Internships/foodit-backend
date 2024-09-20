import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuth2TransportService {
  private oauth2Client: OAuth2Client;
  private transporter: Transporter;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly refreshToken: string,
    private readonly user: string,
  ) {
    this.oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      'https://developers.google.com/oauthplayground',
    );
    this.oauth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });
  }

  async createTransport(): Promise<Transporter> {
    if (!this.transporter) {
      const accessToken = await this.getAccessToken();
      this.transporter = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.user,
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          refreshToken: this.refreshToken,
          accessToken,
        },
      });
    }
    return this.transporter;
  }

  private async getAccessToken(): Promise<string> {
    const { token } = await this.oauth2Client.getAccessToken();
    return token;
  }
}
