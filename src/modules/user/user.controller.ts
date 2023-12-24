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
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { IUser, User } from '../../database/schemas/user.schema';
import { UserService } from './user.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  createUser(@Body() user: IUser): Observable<User> {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Observable<Omit<User, 'password'>> {
    return this.usersService.findUserById(id);
  }

  @Get()
  getUsers(
    @Query('start') start_query?: string,
    @Query('limit') limit_query?: string,
  ): Observable<IPaginatedResponse<Omit<User, 'password'>[]>> {
    const start = parseInt(start_query) || undefined;
    const limit = parseInt(limit_query) || undefined;

    return forkJoin([this.usersService.getUsers(start, limit)]).pipe(
      map(([data]) => {
        return { total: data.length, start, limit, data };
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
