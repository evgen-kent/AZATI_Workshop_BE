import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { BrandService } from './brand.service';
import { GetBrandsQueryDto, IGetBrandsDto } from './brand.dto';
import { ValidateDtoPipe } from '../../pipes/validate.dto.pipe';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @UsePipes(new ValidateDtoPipe())
  getBrands(@Query() queryDto: GetBrandsQueryDto): Promise<IGetBrandsDto> {
    return this.brandService.getBrandsAsync(queryDto.sort);
  }
}
