import { Optional } from '@nestjs/common';

export interface IBrandDto {
  id: string;
  title: string;
}

export interface IGetBrandsDto {
  data: IBrandDto[];
}

interface IGetBrandsQueryDto {
  sort: string;
}

export class GetBrandsQueryDto implements IGetBrandsQueryDto {
  @Optional()
  sort: string;
}
