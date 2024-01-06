import { Controller, Get } from '@nestjs/common';
import { BrandService } from './brand.service';
import { IGetBrandsDto } from './brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {
  }

  @Get()
  getBrands(): Promise<IGetBrandsDto> {
    return this.brandService.getBrandsAsync();
  }

}
