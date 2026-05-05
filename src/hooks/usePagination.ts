import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], initialItemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    initialItemsPerPage, // Export this so the UI knows the "baseline"
    setItemsPerPage,
    setCurrentPage,
    next: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
    prev: () => setCurrentPage(p => Math.max(1, p - 1)),
    startIndex: (currentPage - 1) * itemsPerPage,
  };
}