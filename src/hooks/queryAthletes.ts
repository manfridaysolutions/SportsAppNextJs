import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Athlete } from "@/types/athlete";

export function queryAthletesBySport(sport_id: number | null) {
  const { key, endpoint } = resources.athletes.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Athlete[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}