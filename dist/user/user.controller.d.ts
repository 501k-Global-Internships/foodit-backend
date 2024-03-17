/// <reference types="passport" />
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(req: Request): Express.User;
    updateUser(req: Request, updateUserDto: UpdateUserDto): Promise<string>;
    deactivateUser(req: Request): Promise<string>;
}
