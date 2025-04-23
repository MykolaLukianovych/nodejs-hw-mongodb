export const calcPaginationData = ({ page, perPage, totalItems }) => {
  const totalPages = Math.ceil(totalItems / page);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
