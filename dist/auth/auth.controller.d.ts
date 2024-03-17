import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    home(): string;
    createUser(signupDetails: SignupDto): Promise<import("../typeDef.dto").Tokens>;
    login(loginDetails: LoginDto): Promise<import("../typeDef.dto").Tokens>;
    logout(req: Request): Promise<string>;
    refresh(req: Request): Promise<import("../typeDef.dto").Tokens>;
}
