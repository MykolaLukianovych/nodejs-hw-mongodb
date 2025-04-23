import { sortList } from '../constants/index.js';

export const parseSortParams = ({ sortBy, sortOrder }, sortFields) => {
  const parsedSortOrder = sortList.includes(sortOrder)
    ? sortOrder
    : sortList[0];
  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_contactId';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
