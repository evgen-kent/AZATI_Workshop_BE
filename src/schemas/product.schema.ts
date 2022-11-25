import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Optional } from '@nestjs/common';

export interface IProduct {
  productId: string;
  name: string;
  manufacturer: string;
  price: number;
  in_stock?: boolean;
  country_of_origin?: string;
}

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  manufacturer: string;

  @Prop()
  price: number;

  @Prop()
  @Optional()
  in_stock?: boolean;

  @Prop()
  @Optional()
  country_of_origin?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
