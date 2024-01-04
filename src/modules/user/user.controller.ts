import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { IUser, User } from '../../database/schemas/user.schema';
import { UserService } from './user.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  createUser(@Body() user: IUser): Promise<User> {
    return this.usersService.createUserAsync(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findUserByIdAsync(id);
  }

  @Get()
  async getUsers(
    @Query('start') start_query?: string,
    @Query('limit') limit_query?: string,
  ): Promise<IPaginatedResponse<Omit<User, 'password'>[]>> {
    const start = parseInt(start_query) || undefined;
    const limit = parseInt(limit_query) || undefined;
    const data = await this.usersService.getUsersAsync(start, limit);
    const total = await this.usersService.countAsync();

    return { total, start, limit, data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') userId: string): Promise<{ result: string }> {
    return this.usersService.deleteUserByIdAsync(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() user: Partial<IUser>,
  ): Promise<Partial<User>> {
    return this.usersService.updateUserAsync(userId, user);
  }
}
