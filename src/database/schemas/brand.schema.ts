import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IBrand {
  title: string;
}

export type BrandDocument = Brand & Document;

@Schema()
export class Brand implements IBrand {
  @Prop()
  title: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
