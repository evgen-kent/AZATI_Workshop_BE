import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category,
  CategoryDocument,
} from '../../database/schemas/category.schema';
import { Model } from 'mongoose';
import { ICategoryDto, IGetCategoriesDto } from './category.dto';

interface ICategoryService {
  getCategoriesAsync(sort: string): Promise<IGetCategoriesDto>;
}

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategoriesAsync(sort: string): Promise<IGetCategoriesDto> {
    const sortOptions = sort === 'desc' ? -1 : 1;
    const categories = await this.categoryModel
      .find()
      .sort({ title: sortOptions });
    return { data: categories.map(this.processResponse) };
  }

  private processResponse({ _id, title }): ICategoryDto {
    return { id: _id, title };
  }
}
