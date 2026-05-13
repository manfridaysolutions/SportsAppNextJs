import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet, BASE_URL } from "@/lib/api";

import { Athlete } from "@/types/athlete";

export const resourcesAthletes = {
    idField: 'athlete_id',
    key: ['athletes'] as const,
    endpoint: `${BASE_URL}/athlete/`,
    bySport: (sport_id: number | null) => ({
      key: ['athlete', 'sport', sport_id] as const,
      endpoint: `${BASE_URL}/athlete/by-sport/?sport_id=${sport_id}`,
    }),
    byRoster: (season_id: number | null, team_id: number | null) => ({
      key: ['athlete', 'season', season_id, 'team', team_id] as const,
      endpoint: `${BASE_URL}/athlete/by-roster/?season_id=${season_id}&team_id=${team_id}`,
    })
}

export function queryAthletesBySport(sport_id: number | null) {
  const { key, endpoint } = resourcesAthletes.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Athlete[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}

export function queryAthletesByRoster(season_id: number | null, team_id: number | null) {
  const { key, endpoint } = resourcesAthletes.byRoster(season_id, team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Athlete[]>(endpoint),
    enabled: !!season_id && !!team_id, // Clean shorthand for season_id !== null && team_id !== null
  });
}