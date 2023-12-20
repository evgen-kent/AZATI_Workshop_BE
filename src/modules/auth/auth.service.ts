import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../../schemas/user.schema';
import { hashPasswordAsync } from '../../utils/hash-password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserAsync(
    email: string,
    pass: string,
  ): Promise<Omit<IUser, 'password'>> {
    const user = await lastValueFrom(
      this.usersService.findOneWithPassword(email),
    );
    if (user && user.password === (await hashPasswordAsync(pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: IUser): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
