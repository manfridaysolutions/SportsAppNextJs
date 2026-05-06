import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Season } from "@/types/season";

export const API_ENDPOINT = "/api/v1/season/";

export function useSeasons(leagueId: number | null) {
  return useQuery({
    queryKey: ["seasons", leagueId],
    queryFn: () => apiGet<Season[]>(`${API_ENDPOINT}?league_id=${leagueId}`),
    enabled: !!leagueId
  });
}