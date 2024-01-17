import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

interface ITokenSchema {
  user_id: string;
  refresh_token: string;
  created_at: Date;
}

export type TokenDocument = Token & Document;

@Schema()
export class Token implements ITokenSchema {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  refresh_token: string;

  @Prop({ required: true })
  created_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
