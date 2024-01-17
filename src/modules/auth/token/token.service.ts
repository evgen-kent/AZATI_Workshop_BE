import { User } from '../../../database/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../jwt/jwt.strategy';

interface ITokenService {
  generateTokensAsync(user: User): Promise<any>;

  verifyRefreshTokenAsync(refreshToken: string): Promise<JwtPayload>;

  removeRefreshTokenAsync(refreshToken: string): Promise<void>;
}

@Injectable()
export class TokenService implements ITokenService {
  async generateTokensAsync(user: User): Promise<any> {}

  async verifyRefreshTokenAsync(
    refreshToken: string,
  ): Promise<JwtPayload | any> {}

  async removeRefreshTokenAsync(refreshToken: string): Promise<void> {}
}
