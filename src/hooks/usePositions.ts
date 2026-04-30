import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

import { Position } from "@/types/position";

export const API_ENDPOINT = "/api/v1/position/";

export function usePositions(sportId: number | null) {
  return useQuery({
    queryKey: ["positions", sportId],
    queryFn: () => apiGet<Position[]>(`${API_ENDPOINT}?sport_id=${sportId}`),
    enabled: !!sportId, // Clean shorthand for sportId !== null
  });
}