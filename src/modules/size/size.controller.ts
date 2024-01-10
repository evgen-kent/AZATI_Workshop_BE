import { Controller, Get } from '@nestjs/common';
import { SizeService } from './size.service';
import { IGetSizesDto } from './size.dto';

@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Get()
  getSizes(): Promise<IGetSizesDto> {
    return this.sizeService.getSizesAsync();
  }
}
