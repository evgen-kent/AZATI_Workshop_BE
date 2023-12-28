import { Injectable } from '@nestjs/common';
import { from, map, Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';

interface IPasswordService {
  hashPasswordAsync(password: string): Observable<string>;

  comparePasswordWithHashAsync(
    password: string,
    hash: string,
  ): Observable<boolean>;
}

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 4;

  constructor() {}

  hashPasswordAsync(password: string): Observable<string> {
    return from(bcrypt.hash(password, this.saltRounds));
  }

  comparePasswordWithHashAsync(
    password: string,
    hash: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(password, hash)).pipe(
      map((isValid: boolean) => isValid),
    );
  }
}
