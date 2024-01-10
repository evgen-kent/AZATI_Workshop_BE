import { Optional } from '@nestjs/common';

export interface ICategoryDto {
  id: string;
  title: string;
}

export interface IGetCategoriesDto {
  data: ICategoryDto[];
}

interface IGetCategoriesQueryDto {
  sort: string;
}

export class GetCategoriesQueryDto implements IGetCategoriesQueryDto {
  @Optional()
  sort: string;
}
