import { IUser } from '../../database/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

interface IAuthRequestDto {
  email: string;
  password: string;
  username: string;
}

export class AuthRequestDto implements IAuthRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  username: string;
}

export interface IAuthResponseDto {
  user: IUser;
  token: IToken;
}

export interface IToken {
  access_token: string;
  refresh_token: string;
}

interface IRefreshTokenRequestDto {
  refresh_token: string;
}

export class RefreshTokenRequestDto implements IRefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
