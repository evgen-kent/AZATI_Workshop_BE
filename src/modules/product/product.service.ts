import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IProduct,
  Product,
  ProductDocument,
} from '../../database/schemas/product.schema';
import { Model } from 'mongoose';
import {
  CreateProductRequestDto,
  ICreateProductFiles,
  IProductResponseDto,
} from './product.dto';
import { ColorService } from '../color/color.service';
import { SizeService } from '../size/size.service';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { ICategoryDto } from '../category/category.dto';
import { IBrandDto } from '../brand/brand.dto';
import { IColorDto } from '../color/color.dto';
import { ISizeDto } from '../size/size.dto';

type CreateProductDTO = Exclude<IProduct, 'productId'>;

interface IProductService {
  countAsync(): Promise<number>;

  createOneAsync(
    dto: CreateProductRequestDto,
    files: ICreateProductFiles,
  ): Promise<IProductResponseDto>;

  getAllAsync(start: number, limit: number): Promise<ProductDocument[]>;

  getByIdAsync(id: string): Promise<ProductDocument>;

  deleteOneAsync(id: string): Promise<{ result: string }>;

  updateById(id: string, payload: Partial<IProduct>): Promise<ProductDocument>;
}

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly colorService: ColorService,
    private readonly sizeService: SizeService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  async countAsync(): Promise<number> {
    return this.productModel.countDocuments();
  }

  async createOneAsync(
    dto: CreateProductRequestDto,
    files: ICreateProductFiles,
  ): Promise<any> {
    const processedDto = await this.preProcessCreateProductRequestDtoAsync(
      dto,
      files,
    );
    try {
      const newProduct = new this.productModel(processedDto);
      await newProduct.save();
      return await this.processResponseAsync(newProduct);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllAsync(start = 0, limit = 50): Promise<ProductDocument[]> {
    return await this.productModel.find().skip(start).limit(limit).exec();
  }

  async getByIdAsync(id: string): Promise<ProductDocument> {
    return this.productModel.findOne({ _id: id });
  }

  async deleteOneAsync(id: string): Promise<{ result: string }> {
    await this.productModel.deleteOne({ _id: id });
    return { result: 'ok' };
  }

  async updateById(
    id: string,
    payload: Partial<IProduct>,
  ): Promise<ProductDocument> {
    return this.productModel.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
  }

  private async preProcessCreateProductRequestDtoAsync(
    dto: CreateProductRequestDto,
    files: ICreateProductFiles,
  ) {
    await this.brandService.findByIdAsync(dto.brand_id);
    await this.categoryService.findByIdAsync(dto.category_id);

    const costInt = parseInt(dto.cost) || 0;
    const discountInt = parseInt(dto.discount) || 0;
    const total_cost = this.findTotalCost(costInt, discountInt);
    const colors = await this.processColorStringsAsync(dto.colors);
    const sizes = await this.processSizeStringsAsync(dto.sizes);
    const image_path = files.image[0].filename;
    const additional_images = files.additional_images.map(
      (file) => file.filename,
    );
    return {
      title: dto.title,
      description: dto.description,
      cost: dto.cost,
      discount: dto.discount,
      total_cost: total_cost,
      rate: 0,
      category_id: dto.category_id,
      brand_id: dto.brand_id,
      colors: colors,
      sizes: sizes,
      image_path,
      additional_images,
    };
  }

  private findTotalCost(cost: number, discount: number): number {
    if (discount < 0 || discount > 100) {
      throw new BadRequestException('Discount should be between 0 and 100');
    }
    const discountAmount = (cost * discount) / 100;
    return cost - discountAmount;
  }

  private async processColorStringsAsync(
    colorStr: string,
  ): Promise<{ id: string; available: boolean }[]> {
    const colorIds = colorStr.split(',');
    return await Promise.all(
      colorIds.map(async (id) => {
        await this.colorService.findByIdAsync(id);
        return {
          id,
          available: true,
        };
      }),
    );
  }

  private async processSizeStringsAsync(
    sizeStr: string,
  ): Promise<{ id: string; available: boolean }[]> {
    const sizeIds = sizeStr.split(',');
    return await Promise.all(
      sizeIds.map(async (id) => {
        await this.sizeService.findByIdAsync(id);
        return {
          id,
          available: true,
        };
      }),
    );
  }

  private async processResponseAsync(
    document: ProductDocument,
  ): Promise<IProductResponseDto> {
    const fullCategory = await this.categoryService.findByIdAsync(
      document.category_id,
    );
    const fullBrand = await this.brandService.findByIdAsync(document.brand_id);
    const fullColors = await this.makeFullColorsAsync(document);
    const fullSizes = await this.makeFullSizesAsync(document);

    return {
      title: document.title,
      description: document.description,
      cost: document.cost,
      discount: document.discount,
      total_cost: document.total_cost,
      rate: document.rate,
      category: { id: fullCategory.id, title: fullCategory.title },
      brand: { id: fullBrand.id, title: fullCategory.title },
      colors: fullColors,
      size: fullSizes,
      image_path: document.image_path,
      additional_images: document.additional_images,
    };
  }

  private async makeFullColorsAsync(
    document: ProductDocument,
  ): Promise<Omit<IColorDto, 'available'>[]> {
    return await Promise.all(
      document.colors.map(async (color) => {
        const fullColor = await this.colorService.findByIdAsync(color.id);
        return {
          id: fullColor.id,
          title: fullColor.title,
          hex: fullColor.hex,
          available: color.available,
        };
      }),
    );
  }

  private async makeFullSizesAsync(
    document: ProductDocument,
  ): Promise<Omit<ISizeDto, 'available'>[]> {
    return await Promise.all(
      document.sizes.map(async (size) => {
        const fullSize = await this.sizeService.findByIdAsync(size.id);
        return {
          id: fullSize.id,
          title: fullSize.title,
          value: fullSize.value,
          available: size.available,
        };
      }),
    );
  }
}
