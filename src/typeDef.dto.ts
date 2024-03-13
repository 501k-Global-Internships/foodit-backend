export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Vendor = 'vendor',
  Moderator = 'moderator',
}

export class Tokens {
  /** example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y */
  accessToken: string;

  /** example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y */
  refreshToken: string;
}

export class JwtPayload {
  sub: number;
  email: string;
}
