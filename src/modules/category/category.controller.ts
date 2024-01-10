import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ValidateDtoPipe } from '../../pipes/validate.dto.pipe';
import { GetCategoriesQueryDto, IGetCategoriesDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UsePipes(new ValidateDtoPipe())
  getCategories(
    @Query() queryDto: GetCategoriesQueryDto,
  ): Promise<IGetCategoriesDto> {
    return this.categoryService.getCategoriesAsync(queryDto.sort);
  }
}
