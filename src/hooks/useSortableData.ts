import { useMemo, useState } from "react";

export type SortConfig = {
  key: string;
  order: "asc" | "desc";
};

export function useSortableData<T>(items: T[], config: SortConfig[] = []) {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfigs.length > 0) {
      sortableItems.sort((a, b) => {
        for (const { key, order } of sortConfigs) {
          const aValue = a[key as keyof T];
          const bValue = b[key as keyof T];

          if (aValue < bValue) return order === "asc" ? -1 : 1;
          if (aValue > bValue) return order === "asc" ? 1 : -1;
          // If equal, the loop continues to the next sort config
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfigs]);

  const requestSort = (key: string, multi: boolean = false) => {
    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex((conf) => conf.key === key);
      let newConfigs = [...prev];

      if (existingIndex > -1) {
        // Toggle direction
        const currentOrder = newConfigs[existingIndex].order;
        newConfigs[existingIndex] = {
          key,
          order: currentOrder === "asc" ? "desc" : "asc",
        };
        // If not holding shift, make this the ONLY sort
        if (!multi) newConfigs = [newConfigs[existingIndex]];
      } else {
        const newRule: SortConfig = { key, order: "asc" };
        newConfigs = multi ? [...prev, newRule] : [newRule];
      }
      return newConfigs;
    });
  };

  return { items: sortedItems, requestSort, sortConfigs };
}