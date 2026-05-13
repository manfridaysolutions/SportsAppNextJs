import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Sport } from "@/types/sport";
import { Position } from "@/types/position";

export function queryPositions(sport: Sport | null) {
    const { key, endpoint } = resources.positions.bySport(sport?.sport_id ?? null);
    
  return useQuery({
    queryKey: ["positions", sport?.sport_id ?? null],
    queryFn: () => apiGet<Position[]>(endpoint),
    enabled: !!sport?.sport_id, // Clean shorthand for sportId !== null
  });
}
