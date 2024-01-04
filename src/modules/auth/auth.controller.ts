import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto, IAuthResponseDto } from './auth.dto';
import { ValidateDtoPipe } from '../../pipes/validate.dto.pipe';

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
}
