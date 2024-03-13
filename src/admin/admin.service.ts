import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }
}
