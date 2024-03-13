import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt_at.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from 'src/typeDef.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@SetMetadata('roles', [UserRole.Moderator, UserRole.Admin]) //Allowed Roles
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** API Endpoint to Get all registered Users */
  @ApiUnauthorizedResponse()
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }
}
