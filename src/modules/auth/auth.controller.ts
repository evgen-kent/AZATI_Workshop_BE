import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthRequestDto, AuthResponseDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.authService.loginAsync(dto);
  }

  @Post('signup')
  registration(@Body() dto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.authService.signUpAsync(dto);
  }
}
