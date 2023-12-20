import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Optional } from '@nestjs/common';

export type IUser = {
  id: string;
  name?: string;
  lastname?: string;
  email: string;
  password?: string;
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  @Optional()
  name?: string;

  @Prop()
  @Optional()
  lastname?: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
