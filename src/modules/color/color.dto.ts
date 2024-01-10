export interface IColorDto {
  id: string;
  title: string;
  hex: string;
}

export interface IGetColorsDto {
  data: IColorDto[];
}
