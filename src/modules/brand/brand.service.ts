import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from '../../database/schemas/brands.schema';
import { Model, Promise } from 'mongoose';
import { IBrandDto, IGetBrandsDto } from './brand.dto';

interface IBrandService {
  getBrandsAsync(): Promise<IGetBrandsDto>;
}

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async getBrandsAsync(): Promise<IGetBrandsDto> {
    const brands = await this.brandModel.find();
    return { data: brands.map(this.processResponse) };
  }

  private processResponse({ _id, title }): IBrandDto {
    return { id: _id, title };
  }
}
