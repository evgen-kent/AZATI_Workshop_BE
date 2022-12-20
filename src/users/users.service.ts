import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { IUser, User, UserDocument } from 'src/schemas/user.schema';

type CreateUserDto = Exclude<IUser, 'password'>;

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      userId: '1',
      username: 'john',
      password: '123123123',
    },
    {
      userId: '2',
      username: 'maria',
      password: '123123123',
    },
  ];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  count(): Observable<number> {
    return <Observable<number>>from(this.userModel.count());
  }

  findOneWithPassword(username: string): Observable<IUser | undefined> {
    return of(this.users.find((user) => user.username === username)).pipe(
      mergeMap((user) => {
        if (user) {
          return of(user);
        }
        return from(this.userModel.findOne({ username })).pipe(
          map((document) => {
            if (!document) {
              throw new HttpException('Not Authorized', 401);
            }
            const { _id, username, password } = document;
            return { userId: _id, username, password };
          }),
        );
      }),
    );
  }

  createUser(createUserDto: CreateUserDto): Observable<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return from(createdUser.save());
  }

  getUsers(start: number, limit: number): Observable<Omit<User, 'password'>[]> {
    return from(this.userModel.find().skip(start).limit(limit).exec()).pipe(
      map((users) => users.map(this.obfuscateUser)),
    );
  }

  findUser(_id: string): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ _id })).pipe(map(this.obfuscateUser));
  }

  deleteUser(userId: string): Observable<{ result: string }> {
    return from(this.userModel.deleteOne({ _id: userId })).pipe(
      map(() => ({ result: 'ok' })),
    );
  }

  updateUser(
    userId: string,
    user: Partial<IUser>,
  ): Observable<Partial<UserDocument>> {
    return from(
      this.userModel.findOneAndUpdate({ _id: userId }, user, { new: true }),
    ).pipe(map(this.obfuscateUser));
  }

  obfuscateUser({
    _id,
    username,
    email,
    site,
    phone,
    avatar,
  }: UserDocument): Omit<IUser, 'password'> {
    return { userId: _id, username, email, site, phone, avatar };
  }
}
