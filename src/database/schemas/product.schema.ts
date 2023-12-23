import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Optional } from '@nestjs/common';

export interface IProduct {
  productId: string;
  name: string;
  manufacturer: string;
  width?: number;
  height?: number;
  depth?: number;
  image?: string;
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
  @Optional()
  width?: number;

  @Prop()
  @Optional()
  height?: number;

  @Prop()
  @Optional()
  depth?: number;

  @Prop()
  @Optional()
  image?: string;

  @Prop()
  @Optional()
  country_of_origin?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
