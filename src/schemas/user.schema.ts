import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IUser = {
  userId: string;
  username: string;
  password?: string;
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
