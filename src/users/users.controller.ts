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
import { map, Observable, switchMap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUser, User } from '../schemas/user.schema';
import { UsersService } from './users.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { IPaginatedResponse } from '../interfaces/paginated-response.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
    let total = 0;

    return this.usersService.count().pipe(
      switchMap((count) => {
        total = count;
        return this.usersService.getUsers(start, limit);
      }),
      map((users) => {
        return { total, start, limit, data: users };
      }),
    );
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string): Observable<{ result: string }> {
    return this.usersService.deleteUser(userId);
  }

  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() user: Partial<IUser>,
  ): Observable<Partial<User>> {
    return this.usersService.updateUser(userId, user);
  }
}
