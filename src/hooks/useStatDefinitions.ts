import { useQuery } from "@tanstack/react-query";
import { apiGet, } from "@/lib/api";
import { StatDefinition } from "@/types/statDefinition";

export const API_ENDPOINT = "/api/v1/statDefinition/";

export function useStatDefinitions(sportId: number | null) {
  return useQuery({
    queryKey: ["statDefinitions", sportId],
    queryFn: () => apiGet<StatDefinition[]>(`${API_ENDPOINT}?sport_id=${sportId}`),
    enabled: !!sportId, // Clean shorthand for sportId !== null
  });
}