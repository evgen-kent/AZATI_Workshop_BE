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
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAll(
    @Query('start') start: number,
    @Query('limit') limit: number,
  ): Observable<ProductDocument[]> {
    return this.productsService.getAll(start, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getById(@Param('id') id: string): Observable<ProductDocument> {
    return this.productsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  createOne(@Body() body: IProduct): Observable<ProductDocument> {
    return this.productsService.createOne(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteById(@Param('id') id: string): Observable<boolean> {
    return this.productsService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() payload: Partial<IProduct>,
  ): Observable<ProductDocument> {
    return this.productsService.updateById(id, payload);
  }
}
