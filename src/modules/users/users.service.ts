import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { IUser, User, UserDocument } from '../../schemas/user.schema';

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
    const findUserInMemory$ = of(
      this.users.find((user) => user.username === username),
    );

    const findUserInDB$ = from(this.userModel.findOne({ username })).pipe(
      mergeMap((document) => {
        if (!document) {
          throw new UnauthorizedException();
        }
        const { _id, username } = document;
        return of({ userId: _id, username });
      }),
    );
    //Combining two user search methods
    return findUserInMemory$.pipe(
      mergeMap((user) => (user ? of(user) : findUserInDB$)),
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
