import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthRequestDto,
  IAuthResponseDto,
  IToken,
  RefreshTokenRequestDto,
} from './auth.dto';
import { ValidateDtoPipe } from '../../pipes/validate.dto.pipe';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidateDtoPipe())
  login(@Body() dto: AuthRequestDto): Promise<IAuthResponseDto> {
    return this.authService.loginAsync(dto);
  }

  @Post('signup')
  @UsePipes(new ValidateDtoPipe())
  registration(@Body() dto: AuthRequestDto): Promise<IAuthResponseDto> {
    return this.authService.signUpAsync(dto);
  }

  @Post('refresh')
  @UsePipes(new ValidateDtoPipe())
  async refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<IToken> {
    return this.authService.refreshAccessTokenAsync(dto.refresh_token);
  }

  @Post('protected')
  @UseGuards(new JwtAuthGuard())
  getProtected() {
    return 'Protected route';
  }
}
