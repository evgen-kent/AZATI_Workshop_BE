import { UserDocument } from '../../../database/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../jwt/jwt.strategy';
import { JwtAuthService } from '../jwt/jwt.auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../../../database/schemas/token.schema';
import { Model } from 'mongoose';
import { IToken } from '../auth.dto';

interface ITokenService {
  generateTokensAsync(user: UserDocument): Promise<IToken>;

  verifyRefreshTokenAsync(refreshToken: string): Promise<JwtPayload>;

  removeRefreshTokenAsync(refreshToken: string): Promise<void>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async generateTokensAsync(user: UserDocument): Promise<IToken> {
    const accessToken =
      await this.jwtAuthService.generateAccessTokenAsync(user);
    const refreshToken =
      await this.jwtAuthService.generateRefreshTokenAsync(user);

    const tokenModel = new this.tokenModel({
      user_id: user.id,
      refresh_token: refreshToken,
      created_at: new Date(),
    });

    await tokenModel.save();

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyRefreshTokenAsync(refresh_token: string): Promise<any> {
    try {
      return await this.jwtAuthService.verifyRefreshTokenAsync(refresh_token);
    } catch (error) {
      await this.removeRefreshTokenAsync(refresh_token);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async removeRefreshTokenAsync(refreshToken: string): Promise<void> {
    await this.tokenModel.findOneAndDelete({ refresh_token: refreshToken });
  }
}
