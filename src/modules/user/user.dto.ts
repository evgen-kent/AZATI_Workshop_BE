import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

interface IUpdateUserRequestDto {
  username: string;
}

export class UpdateUserRequestDto implements IUpdateUserRequestDto {
  @Optional()
  @IsString()
  username: string;
}

interface IGetUsersQueryDto {
  start: string;
  limit: string;
}

export class GetUsersQueryDto implements IGetUsersQueryDto {
  @Optional()
  @IsNotEmpty()
  start: string;
  @Optional()
  @IsNotEmpty()
  limit: string;
}

export interface IUserResponseDto {
  id: string;
  email: string;
  username: string;
}

export interface IDeleteUserResponseDto {
  result: string;
}
