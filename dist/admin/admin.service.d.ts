import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AdminService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
}
