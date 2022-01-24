import { Injectable } from '@nestjs/common';

export type IUser = {
  userId: number;
  username: string;
  password?: string;
};

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      userId: 1,
      username: 'john',
      password: '123123123',
    },
    {
      userId: 2,
      username: 'maria',
      password: '123123123',
    },
  ];

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }
}
