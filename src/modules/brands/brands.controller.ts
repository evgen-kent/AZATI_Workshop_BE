import { Controller } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  private constructor(private readonly brandsService: BrandsService) {}
}
