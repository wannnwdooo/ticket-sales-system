export type ViewByPage<Data> = {
  data: Data;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
