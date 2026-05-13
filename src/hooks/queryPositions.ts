import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Position } from "@/types/position";

export function queryPositions(sport_id: number | null) {
    const { key, endpoint } = resources.positions.bySport(sport_id);
    
  return useQuery({
    queryKey: ["positions", sport_id],
    queryFn: () => apiGet<Position[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}
