import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Team } from "@/types/team";

export const API_ENDPOINT = "/api/v1/team/";

export function useTeams(leagueid: number | null) {
  return useQuery({
    queryKey: ["teams", leagueid],
    queryFn: () => apiGet<Team[]>(`${API_ENDPOINT}?league_id=${leagueid}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}