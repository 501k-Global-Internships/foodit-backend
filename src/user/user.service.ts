import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  // Inject TypeORM repository into the service class to enable interaction with the database
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async updateUser(id: number, updateDetails: UpdateUserDto) {
    await this.userRepository.update({ id }, { ...updateDetails });
    return 'Profile updated successfully!';
  }

  async deactivateUser(id: number) {
    await this.userRepository.delete({ id });
    return 'Profile deactivated successfully!';
  }
}
