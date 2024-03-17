import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from 'src/typeDef.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    createUser(userDetails: SignupDto): Promise<Tokens>;
    login(loginDetails: LoginDto): Promise<Tokens>;
    logout: (id: number) => Promise<import("typeorm").UpdateResult>;
    refreshToken(refreshToken: string, payload: JwtPayload): Promise<Tokens>;
    findByCredentials({ email, password }: LoginDto): Promise<JwtPayload>;
    generateAccessToken: (payload: JwtPayload) => Promise<string>;
    generateRefreshToken(payload: JwtPayload): Promise<string>;
}
