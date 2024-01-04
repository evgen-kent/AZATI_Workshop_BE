import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../../database/schemas/user.schema';

type CreateUserDto = Omit<IUser, 'id'>;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async countAsync(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async createUserAsync(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    try {
      return createdUser.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new BadRequestException('Email already exists.');
      }
      throw new BadRequestException('Could not create user.');
    }
  }

  async getUsersAsync(
    start: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().skip(start).limit(limit).exec();
    return users.map(this.excludeSensitiveFields);
  }

  async findUserByIdAsync(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findOne({ _id: id });
    return this.excludeSensitiveFields(user);
  }

  async findUserByEmailAsync(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async deleteUserByIdAsync(id: string): Promise<{ result: string }> {
    await this.userModel.deleteOne({ _id: id });
    return { result: 'ok' };
  }

  async updateUserAsync(
    id: string,
    user: Partial<IUser>,
  ): Promise<Partial<UserDocument>> {
    const newUser = await this.userModel.findOneAndUpdate({ _id: id }, user, {
      new: true,
    });
    return this.excludeSensitiveFields(newUser);
  }

  excludeSensitiveFields({
    _id,
    email,
  }: UserDocument): Omit<IUser, 'password'> {
    return { id: _id, email };
  }
}
