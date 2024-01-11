import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from '../../database/schemas/brand.schema';
import { Model } from 'mongoose';
import { IBrandDto, IGetBrandsDto } from './brand.dto';

interface IBrandService {
  getBrandsAsync(sort: string): Promise<IGetBrandsDto>;
}

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async getBrandsAsync(sort: string): Promise<IGetBrandsDto> {
    const sortOptions = sort === 'desc' ? -1 : 1;
    const brands = await this.brandModel.find().sort({ title: sortOptions });
    return { data: brands.map(this.processResponse) };
  }

  private processResponse({ _id, title }): IBrandDto {
    return { id: _id, title };
  }
}
