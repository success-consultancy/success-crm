export interface IPagination {
  page?: string;
  limit?: string;
}

type PaginationParamsKeys = keyof IPagination;
export const PAGINATION_PARAMS: Array<PaginationParamsKeys> = ['page', 'limit'];

export enum SortingState {
  Asc = 'asc',
  Desc = 'desc',
}
