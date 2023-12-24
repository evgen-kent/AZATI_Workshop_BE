import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom, map, Observable } from 'rxjs';
import { IUser, User, UserDocument } from '../../database/schemas/user.schema';
import { AuthRequestDto, AuthResponseDto } from './auth.dto';
import { JwtPayload } from './jwt/jwt.strategy';

interface IAuthService {
  loginAsync(dto: AuthRequestDto): Observable<AuthResponseDto>;
  signUpAsync(dto: AuthRequestDto): Observable<AuthResponseDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  loginAsync(dto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.userService.findUserByEmailAsync(dto.email).pipe(
      map((user) => {
        if (!user) {
          throw new BadRequestException('Email not found');
        }
        return this.processResponse(user);
      }),
    );
  }

  signUpAsync(dto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.userService.createUserAsync(dto).pipe(
      map((user) => {
        return this.processResponse(user);
      }),
    );
  }

  private processResponse(user: UserDocument) {
    const payload: JwtPayload = { id: user._id, email: user.email };
    return {
      user: this.userService.excludeSensitiveFields(user),
      token: { access_token: this.jwtService.sign(payload) },
    };
  }
}
