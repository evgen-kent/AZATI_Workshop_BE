import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct, Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { catchError, from, Observable, of, switchMap } from 'rxjs';

type CreateProductDTO = Exclude<IProduct, 'productId'>;

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  createOne(product: CreateProductDTO): Observable<ProductDocument> {
    const { name, price, manufacturer, country_of_origin, in_stock } = product;

    const newProduct = new this.productModel({
      name,
      price,
      manufacturer,
      country_of_origin,
      in_stock,
    });

    return from(newProduct.save());
  }

  getAll(start: number, limit: number): Observable<ProductDocument[]> {
    return from(this.productModel.find().skip(start).limit(limit).exec());
  }

  getById(_id: string): Observable<ProductDocument> {
    return from(this.productModel.findOne({ _id }));
  }

  deleteOne(_id: string): Observable<boolean> {
    return from(this.productModel.deleteOne({ _id })).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  updateById(
    _id: string,
    payload: Partial<IProduct>,
  ): Observable<ProductDocument> {
    const { name, manufacturer, in_stock, price, country_of_origin } = payload;
    const updated = { name, manufacturer, in_stock, price, country_of_origin };

    return from(
      this.productModel.findOneAndUpdate({ _id }, updated, { new: true }),
    );
  }
}
