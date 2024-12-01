import { SortOrder } from '../enums';

export type Pagination = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
};
