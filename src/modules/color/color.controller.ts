import { Controller, Get } from '@nestjs/common';
import { ColorService } from './color.service';
import { IGetColorsDto } from './color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  getColors(): Promise<IGetColorsDto> {
    return this.colorService.getColorsAsync();
  }
}
