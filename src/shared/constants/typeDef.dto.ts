export enum UserType {
  User = 'user',
  Admin = 'admin',
  Vendor = 'vendor',
  Moderator = 'moderator',
}

export enum StatusType {
  ACTIVATED = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
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

export class PasswordRecoveryData {
  /** @example example@mail.com */
  email: string;

  /** @example 'Ismail Tijani' */
  name: string;

  /** example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y */
  resetToken: string;
}
