import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IReview {
  id: string;
  user_id: string;
  product_id: string | null;
  review: string;
}

export type ReviewDocument = Review & Document;

@Schema()
export class Review implements IReview {
  @Prop()
  id: string;
  @Prop()
  user_id: string;
  @Prop()
  product_id: string | null;
  @Prop()
  review: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
