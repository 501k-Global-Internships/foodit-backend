import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
