import { useMemo } from "react";

export function useFilter<T>(items: T[], searchTerm: string, searchableKeys: string[]) {
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const lowerSearch = searchTerm.toLowerCase();

    return items.filter((item) => {
      return searchableKeys.some((key) => {
        const value = item[key as keyof T];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [items, searchTerm, searchableKeys]);

  return filteredItems;
}