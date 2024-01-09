import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../../database/schemas/user.schema';
import { IDeleteUserResponseDto, IUserResponseDto } from './user.dto';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

type CreateUserDto = Omit<IUser, 'id'>;

interface IUserService {
  countAsync(): Promise<number>;

  createUserAsync(createUserDto: CreateUserDto): Promise<UserDocument>;

  getUsersAsync(
    start: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]>;

  findUserByIdAsync(id: string): Promise<Omit<User, 'password'>>;

  findUserByEmailAsync(email: string): Promise<UserDocument>;

  deleteUserByIdAsync(id: string): Promise<{ result: string }>;

  updateUserAsync(
    id: string,
    user: Partial<IUser>,
  ): Promise<Partial<UserDocument>>;

  excludeSensitiveFields({ _id, email }: UserDocument): Omit<IUser, 'password'>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async countAsync(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async createUserAsync(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (!createUserDto.username) {
      createUserDto.username = createUserDto.email.split('@')[0];
    }
    try {
      const createdUser = new this.userModel(createUserDto);
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
  ): Promise<IUserResponseDto[]> {
    const users = await this.userModel.find().skip(start).limit(limit).exec();
    return users.map(this.excludeSensitiveFields);
  }


  async getUsersPaginateAsync(
    start: string,
    limit: string,
  ): Promise<IPaginatedResponse<IUserResponseDto[]>> {
    const startInt = parseInt(start);
    const limitInt = parseInt(limit);
    const data = await this.getUsersAsync(startInt, limitInt);
    const total = await this.countAsync();
    return { total, start: startInt, limit: limitInt, data };
  }

  async findUserByIdAsync(id: string): Promise<IUserResponseDto> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestException(`Cannot find user with id ${id}`);
    }
    return this.excludeSensitiveFields(user);
  }

  async findUserByEmailAsync(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async deleteUserByIdAsync(id: string): Promise<IDeleteUserResponseDto> {
    await this.userModel.deleteOne({ _id: id });
    return { result: 'ok' };
  }

  async updateUserAsync(
    id: string,
    user: Partial<IUser>,
  ): Promise<IUserResponseDto> {
    const newUser = await this.userModel.findOneAndUpdate({ _id: id }, user, {
      new: true,
    });
    if (!newUser) {
      throw new BadRequestException(`Cannot find user with id ${id}`);
    }
    return this.excludeSensitiveFields(newUser);
  }

  excludeSensitiveFields({
    _id,
    email,
    username,
  }: UserDocument): Omit<IUser, 'password'> {
    return { id: _id, email, username };
  }
}
