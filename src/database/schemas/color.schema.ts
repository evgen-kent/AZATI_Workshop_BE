import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IColor {
  title: string;
  hex: string;
}

export type ColorDocument = Color & Document;

@Schema()
export class Color implements IColor {
  @Prop()
  title: string;

  @Prop()
  hex: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);
