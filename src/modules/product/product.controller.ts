import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  IProduct,
  ProductDocument,
} from '../../database/schemas/product.schema';
import { ProductService } from './product.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../../utils/file-upload-utils';
import { CreateProductRequestDto, ICreateProductFiles, IProductResponseDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAll(
    @Query('start') start_query?: string,
    @Query('limit') limit_query?: string,
  ): Promise<IPaginatedResponse<ProductDocument[]>> {
    const start = parseInt(start_query) || undefined;
    const limit = parseInt(limit_query) || undefined;
    const data = await this.productsService.getAllAsync(start, limit);
    const total = await this.productsService.countAsync();
    return { total, start, limit, data };
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<IProductResponseDto> {
    return this.productsService.getByIdAsync(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'additional_images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  createOne(
    @UploadedFiles()
    files: ICreateProductFiles,
    @Body() dto: CreateProductRequestDto,
  ): Promise<IProductResponseDto> {
    return this.productsService.createOneAsync(dto,files);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<{ result: string }> {
    return this.productsService.deleteOneAsync(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() payload: Partial<IProduct>,
  ): Promise<ProductDocument> {
    return this.productsService.updateById(id, payload);
  }
}
