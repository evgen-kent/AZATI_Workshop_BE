import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, from, map, Observable } from 'rxjs';
import { IUser, User, UserDocument } from '../../database/schemas/user.schema';

type CreateUserDto = Omit<IUser, 'id'>;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}


  countAsync(): Observable<number> {
    return <Observable<number>>from(this.userModel.count());
  }

  createUserAsync(createUserDto: CreateUserDto): Observable<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return from(createdUser.save()).pipe(
      catchError((error) => {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.email
        ) {
          throw new BadRequestException('Email already exists.');
        }
        throw new BadRequestException('Could not create user.');
      }),
    );
  }

  getUsersAsync(
    start: number,
    limit: number,
  ): Observable<Omit<User, 'password'>[]> {
    return from(this.userModel.find().skip(start).limit(limit).exec()).pipe(
      map((users) => users.map(this.excludeSensitiveFields)),
    );
  }

  findUserByIdAsync(id: string): Observable<Omit<User, 'password'>> {
    return from(this.userModel.findOne({ _id: id })).pipe(
      map(this.excludeSensitiveFields),
    );
  }

  findUserByEmailAsync(email: string): Observable<UserDocument> {
    return from(this.userModel.findOne({ email }));
  }

  deleteUserByIdAsync(id: string): Observable<{ result: string }> {
    return from(this.userModel.deleteOne({ _id: id })).pipe(
      map(() => ({ result: 'ok' })),
    );
  }

  updateUserAsync(
    id: string,
    user: Partial<IUser>,
  ): Observable<Partial<UserDocument>> {
    return from(
      this.userModel.findOneAndUpdate({ _id: id }, user, { new: true }),
    ).pipe(map(this.excludeSensitiveFields));
  }

  excludeSensitiveFields({ _id, email }: UserDocument): Omit<IUser, 'password'> {
    return { id: _id, email };
  }
}
