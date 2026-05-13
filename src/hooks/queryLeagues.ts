import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { League } from "@/types/league";

export function queryLeaguesDetail(league_id: number | null) {
  const { key, endpoint } = resources.leagues.detail(league_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<League[]>(endpoint),
    enabled: !!league_id,
    select: (data) => (data.length > 0 ? data[0] : null),
  });
}

export function queryLeaguesBySport(sport_id: number | null) {
  const { key, endpoint } = resources.leagues.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<League[]>(endpoint),
    enabled: !!sport_id,
  });
}

export function queryLeaguesBySeason(season_id: number | null) {
  const { key, endpoint } = resources.leagues.bySeason(season_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<League[]>(endpoint),
    enabled: !!season_id,
  });
}