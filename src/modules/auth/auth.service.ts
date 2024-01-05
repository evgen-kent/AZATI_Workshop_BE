import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../database/schemas/user.schema';
import { AuthRequestDto, IAuthResponseDto } from './auth.dto';
import { JwtPayload } from './jwt/jwt.strategy';
import { PasswordService } from './password.service';

interface IAuthService {
  loginAsync(dto: AuthRequestDto): Promise<IAuthResponseDto>;

  signUpAsync(dto: AuthRequestDto): Promise<IAuthResponseDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
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
    return this.processResponse(user);
  }

  async signUpAsync(dto: AuthRequestDto): Promise<IAuthResponseDto> {
    const hashedPassword = await this.passwordService.hashPasswordAsync(
      dto.password,
    );
    const createdUser = await this.userService.createUserAsync({
      ...dto,
      password: hashedPassword,
    });
    return this.processResponse(createdUser);
  }

  private processResponse(user: UserDocument) {
    const payload: JwtPayload = { id: user._id, email: user.email };
    return {
      user: this.userService.excludeSensitiveFields(user),
      token: { access_token: this.jwtService.sign(payload) },
    };
  }
}
