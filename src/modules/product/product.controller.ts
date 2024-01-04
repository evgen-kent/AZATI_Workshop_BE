import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IProduct,
  ProductDocument,
} from '../../database/schemas/product.schema';
import { ProductService } from './product.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { IPaginatedResponse } from '../../interfaces/paginated-response.interface';

@Controller('product')
@UseGuards(JwtAuthGuard)
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
  getById(@Param('id') id: string): Promise<ProductDocument> {
    return this.productsService.getByIdAsync(id);
  }

  @Post()
  createOne(@Body() body: IProduct): Promise<ProductDocument> {
    return this.productsService.createOneAsync(body);
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
