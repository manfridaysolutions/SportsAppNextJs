import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Athlete } from "@/types/athlete";
import { League } from "@/types/league";
import { Position } from "@/types/position";
import { ReferenceCategory } from "@/types/referencecategory";
import { ReferenceValue } from "@/types/referencevalue";
import { Roster } from "@/types/roster";
import { Season } from "@/types/season";
import { Sport } from "@/types/sport";
import { StatDefinition } from "@/types/statDefinition";
import { Team } from "@/types/team";

export function useAthletesBySport(sport_id: number | null) {
  const { key, endpoint } = resources.athletes.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Athlete[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}

export function useLeaguesBySport(sport_id: number | null) {
  const { key, endpoint } = resources.leagues.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<League[]>(endpoint),
    enabled: !!sport_id,
  });
}

export function useLeaguesBySeason(season_id: number | null) {
  const { key, endpoint } = resources.leagues.bySeason(season_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<League[]>(endpoint),
    enabled: !!season_id,
  });
}

export function usePositions(sport_id: number | null) {
    const { key, endpoint } = resources.positions.bySport(sport_id);
    
  return useQuery({
    queryKey: ["positions", sport_id],
    queryFn: () => apiGet<Position[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}

export function useReferenceCategories() {
  const { key, endpoint } = resources.referenceCategories;

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<ReferenceCategory[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useReferenceValues(reference_category_id: number | null) {
  const { key, endpoint } = resources.referenceValues.byCategory(reference_category_id)

  return useQuery({
    queryKey: ["referenceValues", reference_category_id],
    queryFn: () => apiGet<ReferenceValue[]>(endpoint),
    enabled: !!reference_category_id,
  });
}

export function useReferenceValuesForCategories(names: string[]) {
  const { key, endpoint } = resources.referenceCategories.byNames(names);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<ReferenceCategory[]>(endpoint),
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => {
      // Maintains your specific transformation logic
      return data.reduce((acc, category) => {
        acc[category.name] = category.reference_values;
        return acc;
      }, {} as Record<string, ReferenceValue[]>);
    },
  });
}

export function useRosters(season_id: number | null, team_id: number | null) {
  const { key, endpoint } = resources.rosters.bySeasonAndTeam(season_id, team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Roster[]>(endpoint),
    enabled: !!season_id && !!team_id,
  });
}

export function useSeasons(league_id: number | null) {
  const { key, endpoint } = resources.seasons.byLeague(league_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Season[]>(endpoint),
    enabled: !!league_id
  });
}

export function useSports() {
  const { key, endpoint } = resources.sports;

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Sport[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSportById(sport_id: number | null) {
  const { data: sports } = useSports();
  
  if (!sport_id || !sports) return null;
  return sports.find((s) => s.sport_id === sport_id) || null;
}

export function useSportDetail(sport_id: number | null) {
  const { key, endpoint } = resources.sports.detail(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Sport[]>(endpoint),
    enabled: !!sport_id,
    select: (data) => (data.length > 0 ? data[0] : null),
  });
}

export function useStatDefinitions(sport_id: number | null) {
  const { key, endpoint } = resources.statDefinitions.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<StatDefinition[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}

export function useTeams(league_id: number | null) {
  const { key, endpoint } = resources.teams.byLeague(league_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Team[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}