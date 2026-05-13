import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Roster } from "@/types/roster";


export function queryRosters(season_id: number | null, team_id: number | null) {
  const { key, endpoint } = resources.rosters.bySeasonAndTeam(season_id, team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Roster[]>(endpoint),
    enabled: !!season_id && !!team_id,
  });
}