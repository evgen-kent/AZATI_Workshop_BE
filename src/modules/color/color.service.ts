import { Injectable } from '@nestjs/common';
import { IColorDto, IGetColorsDto } from './color.dto';
import { Model, Promise } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Color, ColorDocument } from '../../database/schemas/color.schema';

interface IColorService {
  getColorsAsync(): Promise<IGetColorsDto>;
}

@Injectable()
export class ColorService implements IColorService {
  constructor(
    @InjectModel(Color.name) private readonly colorModel: Model<ColorDocument>,
  ) {}

  async getColorsAsync(): Promise<IGetColorsDto> {
    const colors = await this.colorModel.find();
    return { data: colors.map(this.processResponse) };
  }

  private processResponse({ _id, title, hex }): IColorDto {
    return { id: _id, title, hex };
  }
}
