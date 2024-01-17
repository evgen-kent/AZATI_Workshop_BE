import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRequestDto, IAuthResponseDto, IToken } from './auth.dto';
import { PasswordService } from './password/password.service';
import { TokenService } from './token/token.service';

interface IAuthService {
  loginAsync(dto: AuthRequestDto): Promise<IAuthResponseDto>;

  signUpAsync(dto: AuthRequestDto): Promise<IAuthResponseDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async loginAsync(dto: AuthRequestDto): Promise<IAuthResponseDto> {
    const user = await this.userService.findUserByEmailAsync(dto.email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const passwordIsValid =
      await this.passwordService.comparePasswordWithHashAsync(
        dto.password,
        user.password,
      );
    if (!passwordIsValid) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = await this.tokenService.generateTokensAsync(user);
    return {
      user: this.userService.excludeSensitiveFields(user),
      token: tokens,
    };
  }

  async signUpAsync(dto: AuthRequestDto): Promise<IAuthResponseDto> {
    const hashedPassword = await this.passwordService.hashPasswordAsync(
      dto.password,
    );
    const createdUser = await this.userService.createUserAsync({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokensAsync(createdUser);
    return {
      user: this.userService.excludeSensitiveFields(createdUser),
      token: tokens,
    };
  }

  async refreshAccessTokenAsync(refreshToken: string): Promise<IToken> {
    const payload =
      await this.tokenService.verifyRefreshTokenAsync(refreshToken);

    const user = await this.userService.findByIdAsync(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.tokenService.removeRefreshTokenAsync(refreshToken);

    return this.tokenService.generateTokensAsync(user);
  }
}
