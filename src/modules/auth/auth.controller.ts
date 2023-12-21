import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { IUser, User } from '../../schemas/user.schema';
import { forkJoin, from, Observable, of, switchMap } from 'rxjs';
import { UsersService } from '../users/users.service';

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
  ): Observable<User | { token: { access_token: string } }> {
    //Creating a user
    const createdUser$ = from(this.usersService.createUser(user)).pipe(
      switchMap((userDocument) =>
        of(this.usersService.obfuscateUser(userDocument)),
      ),
    );
    //Creating a token
    const token$ = createdUser$.pipe(
      switchMap((user) => of(this.authService.login(user))),
    );

    return forkJoin({ token: token$, user: createdUser$ });
  }
}
