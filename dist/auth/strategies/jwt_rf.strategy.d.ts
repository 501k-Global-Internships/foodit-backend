import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from 'src/typeDef.dto';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    constructor(configService: ConfigService);
    validate(req: Request, data: JwtPayload): Promise<{
        payload: {
            sub: number;
            email: string;
        };
        refreshToken: string;
    }>;
}
export {};
