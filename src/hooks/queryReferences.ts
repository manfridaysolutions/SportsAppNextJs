import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { ReferenceCategory } from "@/types/referencecategory";
import { ReferenceValue } from "@/types/referencevalue";

export function queryReferenceCategories() {
  const { key, endpoint } = resources.referenceCategories;

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<ReferenceCategory[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function queryReferenceValues(reference_category_id: number | null) {
  const { key, endpoint } = resources.referenceValues.byCategory(reference_category_id)

  return useQuery({
    queryKey: ["referenceValues", reference_category_id],
    queryFn: () => apiGet<ReferenceValue[]>(endpoint),
    enabled: !!reference_category_id,
  });
}

export function queryReferenceValuesForCategories(names: string[]) {
  const { key, endpoint } = resources.referenceCategories.byNames(names);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<ReferenceCategory[]>(endpoint),
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => {
      // Maintains your specific transformation logic
      return data.reduce((acc, category) => {
        acc[category.name] = category.reference_values;
        return acc;
      }, {} as Record<string, ReferenceValue[]>);
    },
  });
}
