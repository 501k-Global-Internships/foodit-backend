import { UserRole } from 'src/typeDef.dto';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    refreshToken: string;
    hashPassword(): Promise<void>;
    constructor(partial: Partial<User>);
}
