export interface ISizeDto {
  id: string;
  title: string;
  value: number;
}

export interface IGetSizesDto {
  data: ISizeDto[];
}
