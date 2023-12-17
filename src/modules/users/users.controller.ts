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
import { forkJoin, map, Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser, User } from '../../schemas/user.schema';
import { UsersService } from './users.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() user: IUser): Observable<User> {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Observable<Omit<User, 'password'>> {
    return this.usersService.findUser(id);
  }

  @Get()
  getUsers(
    @Query('start') start_query?: string,
    @Query('limit') limit_query?: string,
  ): Observable<IPaginatedResponse<Omit<User, 'password'>[]>> {
    const start = parseInt(start_query) || undefined;
    const limit = parseInt(limit_query) || undefined;

    return forkJoin([
      this.usersService.getUsers(start, limit),
      this.usersService.count(),
    ]).pipe(
      map(([data, total]) => {
        return { total, start, limit, data };
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') userId: string): Observable<{ result: string }> {
    return this.usersService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() user: Partial<IUser>,
  ): Observable<Partial<User>> {
    return this.usersService.updateUser(userId, user);
  }
}
