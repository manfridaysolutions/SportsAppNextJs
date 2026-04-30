import { useQuery } from "@tanstack/react-query";
import { apiGet, } from "@/lib/api";
import { ReferenceValue } from "@/types/referencevalue";

export const API_ENDPOINT = "/api/v1/reference-values/";

export function useReferenceValues(reference_category_id: number | null) {
  return useQuery({
    queryKey: ["referenceValues", reference_category_id],
    queryFn: () => apiGet<ReferenceValue[]>(`${API_ENDPOINT}?reference_category_id=${reference_category_id}`),
    enabled: !!reference_category_id, // Clean shorthand for sportId !== null
  });
}