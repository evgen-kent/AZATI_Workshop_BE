import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ICategory {
  title: string;
}

export type CategoryDocument = Category & Document;

@Schema()
export class Category implements ICategory {
  @Prop()
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
