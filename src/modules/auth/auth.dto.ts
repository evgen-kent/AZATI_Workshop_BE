import { IUser } from '../../database/schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

interface IAuthRequestDto {
  email: string;
  password: string;
}

export class AuthRequestDto implements IAuthRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export interface AuthResponseDto {
  user: IUser;
  token: { access_token: string };
}
