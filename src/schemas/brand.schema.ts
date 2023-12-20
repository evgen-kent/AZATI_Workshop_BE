import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IBrand = {
  title: string;
};

export type BrandDocument = Brand & Document;

@Schema()
export class Brand {
  @Prop()
  title: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
