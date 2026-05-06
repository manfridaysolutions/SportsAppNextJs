import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Roster } from "@/types/roster";

export const API_ENDPOINT = "/api/v1/roster/";

export function useRosters(seasonId: number | null, teamId: number | null) {
  return useQuery({
    queryKey: ["rosters", seasonId, teamId],
    queryFn: () => apiGet<Roster[]>(`${API_ENDPOINT}?season_id=${seasonId}&team_id=${teamId}`),
    enabled: !!seasonId && !!teamId
  });
}