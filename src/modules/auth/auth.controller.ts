import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser, User } from '../../schemas/user.schema';
import { from, map, Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): { access_token: string } {
    return this.authService.login(req.user);
  }

  @Post('registration')
  registration(
    @Body() user: IUser,
  ): Observable<IUser | { accessToken: string }> {
    const createdUser = this.usersService.createUser(user.email, user.password);
    return from(createdUser).pipe(
      map((user) => {
        return {
          id: user.id,
          email: user.email,
          ...this.authService.login(user),
        };
      }),
    );
  }
}
