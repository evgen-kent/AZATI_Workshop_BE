import { IUser } from '../../database/schemas/user.schema';

export interface AuthRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: IUser;
  token: { access_token: string };
}
