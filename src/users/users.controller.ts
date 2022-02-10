import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUser, User } from '../schemas/user.schema';
import { UsersService } from './users.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Post()
  createUser(@Body() user: IUser): Observable<User> {
    return this.usersService.createUser(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string): Observable<Omit<User, 'password'>> {
    return this.usersService.findUser(id);
  }

  @Get()
  getUsers(@Query('start') start?: string, @Query('limit') limit?: string): Observable<Omit<User, 'password'>[]> {
    return this.usersService.getUsers(+start ? +start - 1 : 0, +limit || 50);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string): Observable<{ result: string }> {
    return this.usersService.deleteUser(userId);
  }

  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() user: Partial<IUser>): Observable<Partial<User>> {
    return this.usersService.updateUser(userId, user);
  }
}
