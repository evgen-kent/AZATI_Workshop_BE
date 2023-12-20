import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { IUser, User, UserDocument } from '../../schemas/user.schema';
import { hashPasswordAsync } from '../../utils/hash-password';

type CreateUserDto = Exclude<IUser, 'password'>;

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      id: '1',
      name: 'john',
      lastname: 'smith',
      email: 'test2@gmail.com',
      password: '123123123',
    },
    {
      id: '2',
      name: 'maria',
      lastname: 'sweet',
      email: 'test3@gmail.com',
      password: '123123123',
    },
  ];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  count(): Observable<number> {
    return <Observable<number>>from(this.userModel.count());
  }

  findOneWithPassword(email: string): Observable<IUser | undefined> {
    return of(this.users.find((user) => user.email === email)).pipe(
      mergeMap((user) => {
        if (user) {
          return of(user);
        }
        return from(this.userModel.findOne({ email })).pipe(
          map((document) => {
            if (!document) {
              throw new UnauthorizedException();
            }
            const { _id, name, lastname, email, password } = document;
            return { id: _id, name, lastname, email, password };
          }),
        );
      }),
    );
  }

  createUser(email: string, password: string): Observable<CreateUserDto> {
    return from(hashPasswordAsync(password)).pipe(
      switchMap((hashedPassword: string) => {
        const createUserDto: Omit<CreateUserDto, 'id'> = {
          email,
          password: hashedPassword,
        };
        const createdUser = new this.userModel(createUserDto);

        return from(createdUser.save()).pipe(
          map((user): IUser => {
            return {
              id: user._id,
              email: user.email,
            };
          }),
          catchError((error: NativeError) => {
            if ((error as any).code === 11000) {
              return throwError(
                () =>
                  new BadRequestException(
                    `User with email ${email} already exists`,
                  ),
              );
            } else
              return throwError(
                () =>
                  new InternalServerErrorException('Error while creating user'),
              );
          }),
        );
      }),
    );
  }

  getUsers(start: number, limit: number): Observable<Omit<User, 'password'>[]> {
    return from(this.userModel.find().skip(start).limit(limit).exec()).pipe(
      map((users) => users.map(this.obfuscateUser)),
    );
  }

  findUser(id: string): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ _id: id })).pipe(
      map(this.obfuscateUser),
    );
  }

  deleteUser(id: string): Observable<{ result: string }> {
    return from(this.userModel.deleteOne({ _id: id })).pipe(
      map(() => ({ result: 'ok' })),
    );
  }

  updateUser(
    id: string,
    user: Partial<IUser>,
  ): Observable<Partial<UserDocument>> {
    return from(
      this.userModel.findOneAndUpdate({ _id: id }, user, { new: true }),
    ).pipe(map(this.obfuscateUser));
  }

  obfuscateUser({
    _id,
    name,
    lastname,
    email,
  }: UserDocument): Omit<IUser, 'password'> {
    return { id: _id, name, lastname, email };
  }
}
