import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/userAuth/dto/signup.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
