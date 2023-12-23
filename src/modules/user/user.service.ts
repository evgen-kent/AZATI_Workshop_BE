import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { IUser, User, UserDocument } from '../../database/schemas/user.schema';

type CreateUserDto = Omit<IUser, 'id'>;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  createUser(createUserDto: CreateUserDto): Observable<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return from(createdUser.save()).pipe(
      catchError((error) => {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.username
        ) {
          throw new BadRequestException('Username already exists.');
        }
        throw new BadRequestException('Could not create user.');
      }),
    );
  }

  getUsers(start: number, limit: number): Observable<Omit<User, 'password'>[]> {
    return from(this.userModel.find().skip(start).limit(limit).exec()).pipe(
      map((users) => users.map(this.obfuscateUser)),
    );
  }

  findUserById(_id: string): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ _id })).pipe(map(this.obfuscateUser));
  }

  findUserByEmail(email: string): Observable<UserDocument> {
    return from(this.userModel.findOne({ email }));
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

  obfuscateUser({ _id, email }: UserDocument): Omit<IUser, 'password'> {
    return { id: _id, email };
  }
}
