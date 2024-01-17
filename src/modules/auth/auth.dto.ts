import { IUser } from '../../database/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IToken } from './token/token.dto';

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
