import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserDocument } from '../../database/schemas/user.schema';
import { AuthRequestDto, IAuthResponseDto } from './auth.dto';
import { JwtPayload } from './jwt/jwt.strategy';
import { PasswordService } from './password.service';

interface IAuthService {
  loginAsync(dto: AuthRequestDto): Observable<IAuthResponseDto>;

  signUpAsync(dto: AuthRequestDto): Observable<IAuthResponseDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  loginAsync(dto: AuthRequestDto): Observable<IAuthResponseDto> {
    return this.userService.findUserByEmailAsync(dto.email).pipe(
      switchMap((user) => {
        if (!user) {
          throw new BadRequestException('Email not found');
        }
        return this.passwordService
          .comparePasswordWithHashAsync(dto.password, user.password)
          .pipe(
            map((isValid) => {
              if (!isValid) {
                throw new BadRequestException('Invalid password');
              }
              return this.processResponse(user);
            }),
          );
      }),
    );
  }

  signUpAsync(dto: AuthRequestDto): Observable<IAuthResponseDto> {
    return this.passwordService.hashPasswordAsync(dto.password).pipe(
      switchMap((hashedPassword) =>
        this.userService
          .createUserAsync({ ...dto, password: hashedPassword })
          .pipe(
            switchMap((user) => {
              return of(this.processResponse(user));
            }),
          ),
      ),
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
