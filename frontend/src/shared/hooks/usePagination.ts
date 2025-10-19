import { useState, useEffect } from 'preact/hooks';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  onPageChange,
  onPageSizeChange,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  useEffect(() => {
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    }
  }, [pageSize, onPageSizeChange]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const reset = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    page,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
  };
}
