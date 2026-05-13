import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Team } from "@/types/team";

export function queryTeams(league_id: number | null) {
  const { key, endpoint } = resources.teams.byLeague(league_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Team[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}