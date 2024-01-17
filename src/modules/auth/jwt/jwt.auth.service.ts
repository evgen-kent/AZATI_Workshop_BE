import { UserDocument } from '../../../database/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

interface IJwtAuthService {
  generateAccessTokenAsync(user: UserDocument): Promise<string>;

  generateRefreshTokenAsync(user: UserDocument): Promise<string>;

  verifyRefreshTokenAsync(refresh_token: string): Promise<any>;
}

@Injectable()
export class JwtAuthService implements IJwtAuthService {
  private accessTokenLifetime = '1h';
  private refreshTokenLifetime = '7d';

  constructor(private readonly jwtService: JwtService) {}

  async generateAccessTokenAsync(user: UserDocument): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenLifetime,
    });
  }

  async generateRefreshTokenAsync(user: UserDocument): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenLifetime,
    });
  }

  async verifyRefreshTokenAsync(refresh_token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(refresh_token);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
