import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ISizeSchema {
  title: string;
  value: number;
}

export type SizeDocument = Size & Document;

@Schema()
export class Size implements ISizeSchema {
  @Prop()
  title: string;

  @Prop()
  value: number;
}

export const SizeSchema = SchemaFactory.createForClass(Size);
