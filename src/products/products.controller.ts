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
import { Observable } from 'rxjs';
import { IProduct, ProductDocument } from '../schemas/product.schema';
import { ProductsService } from './products.service';
import { Patch } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(
    @Query('start') start?: number,
    @Query('limit') limit?: number,
  ): Observable<ProductDocument[]> {
    return this.productsService.getAll(start, limit);
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<ProductDocument> {
    return this.productsService.getById(id);
  }

  @Post()
  createOne(@Body() body: IProduct): Observable<ProductDocument> {
    return this.productsService.createOne(body);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Observable<{ result: string }> {
    return this.productsService.deleteOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() payload: Partial<IProduct>,
  ): Observable<ProductDocument> {
    return this.productsService.updateById(id, payload);
  }
}
