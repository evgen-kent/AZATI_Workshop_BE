import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export interface IProduct {
  title: string;
  description: string;
  cost: number;
  discount: number | null;
  total_cost: number;
  rate: number;
  category_id: string;
  brand_id: string;
  colors: { id: string; available: boolean }[];
  sizes: { id: string; available: boolean }[];
  image_path: string;
  additional_images: string[];
}

export type ProductDocument = Product & Document;

@Schema()
export class Product implements IProduct {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  cost: number;

  @Prop({ type: SchemaTypes.String, default: null, min: 1, max: 100 })
  discount: number | null;

  @Prop()
  total_cost: number;

  @Prop({ min: 0, max: 5, default: 0 })
  rate: number;

  @Prop()
  category_id: string;

  @Prop()
  brand_id: string;

  @Prop()
  colors: { id: string; available: boolean }[];

  @Prop()
  sizes: { id: string; available: boolean }[];

  @Prop()
  image_path: string;

  @Prop()
  additional_images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
