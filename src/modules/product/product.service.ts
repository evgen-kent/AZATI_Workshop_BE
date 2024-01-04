import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IProduct,
  Product,
  ProductDocument,
} from '../../database/schemas/product.schema';
import { Model } from 'mongoose';

type CreateProductDTO = Exclude<IProduct, 'productId'>;

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async countAsync(): Promise<number> {
    return this.productModel.countDocuments();
  }

  async createOneAsync(product: CreateProductDTO): Promise<ProductDocument> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async getAllAsync(start = 0, limit = 50): Promise<ProductDocument[]> {
    return await this.productModel.find().skip(start).limit(limit).exec();
  }

  async getByIdAsync(_id: string): Promise<ProductDocument> {
    return this.productModel.findOne({ _id });
  }

  async deleteOneAsync(_id: string): Promise<{ result: string }> {
    await this.productModel.deleteOne({ _id });
    return { result: 'ok' };
  }

  async updateById(
    _id: string,
    payload: Partial<IProduct>,
  ): Promise<ProductDocument> {
    return this.productModel.findOneAndUpdate({ _id }, payload, { new: true });
  }
}
