import { useQuery } from "@tanstack/react-query";

import { apiGet, BASE_URL } from "@/lib/api";
import { Roster } from "@/types/roster";

export const RosterResources = {
    idField: 'roster_id',
    key: ['rosters'] as const,
    endpoint: `${BASE_URL}/roster/`,
    // Identity and Location for the roster filtered by season and team
    bySeasonAndTeam: (season_id: number | null, team_id: number | null) => ({
      key: ['roster', 'season', season_id, 'team', team_id] as const,
      endpoint: `${BASE_URL}/roster/?season_id=${season_id}&team_id=${team_id}`,
    }),
}

export function queryRosters(season_id: number | null, team_id: number | null) {
  const { key, endpoint } = RosterResources.bySeasonAndTeam(season_id, team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Roster[]>(endpoint),
    enabled: !!season_id && !!team_id,
  });
}