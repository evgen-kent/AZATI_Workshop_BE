import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {IUser, User} from "../schemas/user.schema";
import {Observable} from "rxjs";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): { access_token: string } {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('registration')
  registration(@Body() user: IUser): Observable<User> {
    return this.usersService.createUser(user);
  }
}
