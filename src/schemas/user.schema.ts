import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Optional } from '@nestjs/common';

export type IUser = {
  userId: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  site?: string;
  avatar?: string;
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  @Optional()
  email?: string;

  @Prop()
  @Optional()
  phone?: string;

  @Prop()
  @Optional()
  site?: string;

  @Prop()
  @Optional()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
