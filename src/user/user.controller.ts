import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt_at.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard)
//Removing sensitive through serialization
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** API Endpoint for retrieving user information. */
  @Get('me')
  getUser(@Req() req: Request) {
    return req.user;
  }

  /** API Endpoint for updating user information. */
  @Patch()
  updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  /**
   * It finds and updates data matching the given ID.
   *  If it cannot find it, it returns an error
   */
  @ApiOperation({ description: 'API Endpoint for deactivating user data' })
  @Delete('deactivate')
  deactivateUser(@Req() req: Request) {
    return this.userService.deactivateUser(req.user.id);
  }
}
