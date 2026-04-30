import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { League } from "@/types/league";

export function useLeagues(sportId: number | null) {
  return useQuery({
    queryKey: ["leagues", sportId],
    queryFn: () => apiGet<League[]>(`/api/v1/league/?sport_id=${sportId}`),
    enabled: !!sportId, // Clean shorthand for sportId !== null
  });
}