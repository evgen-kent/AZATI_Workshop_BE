import {
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser, User } from '../../schemas/user.schema';
import { from, map, Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Headers('password') password: string,
    @Headers('email') email: string,
  ): Promise<{ access_token: string }> {
    const user = await this.authService.validateUserAsync(email, password);
    return this.authService.login(user);
  }

  @Post('registration')
  registration(
    @Headers('password') password: string,
    @Headers('email') email: string,
  ): Observable<IUser | { accessToken: string }> {
    const user = this.usersService.createUser(email, password);
    return from(user).pipe(
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
