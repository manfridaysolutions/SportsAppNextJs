import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { League } from "@/types/league";

export const API_ENDPOINT = "/api/v1/league/";

export function useLeagues(sportId: number | null) {
  return useQuery({
    queryKey: ["leagues", sportId],
    queryFn: () => apiGet<League[]>(`${API_ENDPOINT}?sport_id=${sportId}`),
    enabled: !!sportId, // Clean shorthand for sportId !== null
  });
}