import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { ReferenceCategory } from "@/types/referencecategory";

export const API_ENDPOINT = "/api/v1/reference-categories/";

export const referenceCategoryKeys = {
  all: ["referenceCategories"] as const,
};

export function useReferenceCategories() {
  return useQuery({
    queryKey: referenceCategoryKeys.all,
    queryFn: () => apiGet<ReferenceCategory[]>("/api/v1/reference-categories/"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}