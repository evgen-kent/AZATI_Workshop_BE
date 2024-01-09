import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Optional } from '@nestjs/common';

export type IUser = {
  id: string;
  email: string;
  username:string;
  password?: string;
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
