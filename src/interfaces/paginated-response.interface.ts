export interface IPaginatedResponse<T> {
  total: number;
  start?: number;
  limit?: number;
  data: T;
}
