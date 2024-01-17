import { UserDocument } from '../../../database/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../jwt/jwt.strategy';
import { UserService } from '../../user/user.service';
import { JwtAuthService } from '../jwt/jwt.auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../../../database/schemas/token.schema';
import { Model } from 'mongoose';

interface ITokenService {
  generateTokensAsync(user: UserDocument): Promise<any>;

  verifyRefreshTokenAsync(refreshToken: string): Promise<JwtPayload>;

  removeRefreshTokenAsync(refreshToken: string): Promise<void>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async generateTokensAsync(user: UserDocument): Promise<any> {
    const accessToken =
      await this.jwtAuthService.generateAccessTokenAsync(user);
    const refreshToken =
      await this.jwtAuthService.generateRefreshTokenAsync(user);

    const tokenModel = new this.tokenModel({
      user_id: user.id,
      refresh_token: refreshToken,
      created_at: Date.now(),
    });

    await tokenModel.save();

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyRefreshTokenAsync(
    refreshToken: string,
  ): Promise<JwtPayload | any> {
    const decoded =
      await this.jwtAuthService.verifyRefreshTokenAsync(refreshToken);
    const storedToken = await this.tokenModel.findOne({
      refresh_token: refreshToken,
    });

    if (!storedToken || new Date() > storedToken.created_at) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return decoded;
  }

  async removeRefreshTokenAsync(refreshToken: string): Promise<void> {
    await this.tokenModel.findOneAndDelete({ refresh_token: refreshToken });
  }
}
