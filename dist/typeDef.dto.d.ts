export declare enum UserRole {
    User = "user",
    Admin = "admin",
    Vendor = "vendor",
    Moderator = "moderator"
}
export declare class Tokens {
    accessToken: string;
    refreshToken: string;
}
export declare class JwtPayload {
    sub: number;
    email: string;
}
