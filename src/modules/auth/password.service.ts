import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

interface IPasswordService {
  hashPasswordAsync(password: string): Promise<string>;

  comparePasswordWithHashAsync(
    password: string,
    hash: string,
  ): Promise<boolean>;
}

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 4;

  constructor() {}

  async hashPasswordAsync(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswordWithHashAsync(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
