import { useQuery } from "@tanstack/react-query";
import { fetchReferenceValues } from "@/lib/api";

import { ReferenceCategory } from "@/types/referencecategory";
import { ReferenceValue } from "@/types/referencevalue";

export function useReferenceValues(names: string[]) {
  return useQuery({
    queryKey: ["reference-categories", names],
    queryFn: () => fetchReferenceValues(names),
    staleTime: 1000 * 60 * 10,
    select: (data: ReferenceCategory[]) => {
      // Ensure we are reducing into an object keyed by the category NAME
      return data.reduce((acc, category) => {
        // Use .name because the API returns {"name": "SportCategory", ...}
        acc[category.name] = category.reference_values;
        return acc;
      }, {} as Record<string, ReferenceValue[]>);
    },
  });
}