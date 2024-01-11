import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Size, SizeDocument } from '../../database/schemas/size.schema';
import { Model } from 'mongoose';
import { IGetSizesDto, ISizeDto } from './size.dto';

interface ISizeService {
  getSizesAsync(): Promise<IGetSizesDto>;
}

@Injectable()
export class SizeService implements ISizeService {
  constructor(
    @InjectModel(Size.name) private readonly sizeModel: Model<SizeDocument>,
  ) {}

  async getSizesAsync(): Promise<any> {
    const sizes = await this.sizeModel.find();
    return { data: sizes.map(this.processResponse) };
  }

  private processResponse({ _id, title, value }): ISizeDto {
    return { id: _id, title, value };
  }
}
