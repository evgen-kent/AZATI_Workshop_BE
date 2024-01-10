import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export interface IReview {
  user_id: string;
  product_id: string | null;
  review: string;
  rate: number;
}

export type ReviewDocument = Review & Document;

@Schema()
export class Review implements IReview {
  @Prop({ required: true })
  user_id: string;

  @Prop({ type: SchemaTypes.String, default: null })
  product_id: string | null;

  @Prop({ required: true })
  review: string;

  @Prop({ min: 1, max: 5 })
  rate: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
