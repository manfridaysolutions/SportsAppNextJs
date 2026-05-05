import { useState, useMemo } from "react";

export type SortOrder = "asc" | "desc" | null;

interface SortConfig {
  key: string;
  order: SortOrder;
}

export const useSortableData = <T,>(items: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    order: null,
  });

  // Perform the sort whenever items or sortConfig changes
  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];
    if (sortConfig.order && sortConfig.key) {
      itemsCopy.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values so they don't break the sort
        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return itemsCopy;
  }, [items, sortConfig]);

  // Function to toggle through Asc -> Desc -> None
  const requestSort = (key: string) => {
    let order: SortOrder = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    } else if (sortConfig.key === key && sortConfig.order === "desc") {
      order = null;
    }
    setSortConfig({ key, order });
  };

  return { items: sortedItems, requestSort, sortConfig };
};