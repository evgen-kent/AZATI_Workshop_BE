import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct, Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { from, map, Observable } from 'rxjs';

type CreateProductDTO = Exclude<IProduct, 'productId'>;

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  count(): Observable<number> {
    return <Observable<number>>from(this.productModel.count());
  }

  createOne(product: CreateProductDTO): Observable<ProductDocument> {
    const newProduct = new this.productModel(product);
    return from(newProduct.save());
  }

  getAll(start = 0, limit = 50): Observable<ProductDocument[]> {
    return from(this.productModel.find().skip(start).limit(limit).exec());
  }

  getById(_id: string): Observable<ProductDocument> {
    return from(this.productModel.findOne({ _id }));
  }

  deleteOne(_id: string): Observable<{ result: string }> {
    return from(this.productModel.deleteOne({ _id })).pipe(
      map(() => {
        return { result: 'ok' };
      }),
    );
  }

  updateById(
    _id: string,
    payload: Partial<IProduct>,
  ): Observable<ProductDocument> {
    return from(
      this.productModel.findOneAndUpdate({ _id }, payload, { new: true }),
    );
  }
}
