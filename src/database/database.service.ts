import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Size, SizeDocument } from './schemas/size.schema';
import { Color, ColorDocument } from './schemas/color.schema';

type InitDocumentsType =
  | BrandDocument
  | CategoryDocument
  | SizeDocument
  | ColorDocument;


interface IDatabaseService {
  initializeAll(): Promise<void>;

  initialize(collection: Model<InitDocumentsType>, from: string): Promise<void>;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(
    @InjectModel(Size.name) private readonly sizeModel: Model<SizeDocument>,
    @InjectModel(Color.name) private readonly colorModel: Model<ColorDocument>,
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async initializeAll(): Promise<void> {
    await this.initialize(this.sizeModel, 'sizes.json');
    await this.initialize(this.colorModel, 'colors.json');
    await this.initialize(this.brandModel, 'brands.json');
    await this.initialize(this.categoryModel, 'categories.json');
  }

  async initialize(
    collection: Model<InitDocumentsType>,
    from: string,
  ): Promise<void> {
    try {
      const collectionExists = await collection.find().exec();
      if (collectionExists.length === 0) {
        const filePath = path
          .join(__dirname, 'datasets', from)
          .replace('\\dist', '');
        const dataString = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(dataString);
        await collection.create(data);
        console.log(
          `[Database Service] ${collection.modelName} initialized successfully.`,
        );
      }
    } catch (error) {
      console.error(
        `[Database Service] Error initializing ${collection.modelName}:`,
      );
    }
  }
}
