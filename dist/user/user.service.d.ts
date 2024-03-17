import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    updateUser(id: number, updateDetails: UpdateUserDto): Promise<string>;
    deactivateUser(id: number): Promise<string>;
}
