import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Sport } from "@/types/sport";

export const API_ENDPOINT = "/api/v1/sports/";

export const sportKeys = {
  all: ["sports"] as const,
};

export function useSports() {
  return useQuery({
    queryKey: sportKeys.all,
    queryFn: () => apiGet<Sport[]>(API_ENDPOINT),
    staleTime: 1000 * 60 * 60, // Increase to 1 hour since data is static
  });
}

export function useSportById(sport_id: number | null) {
  const { data: sports } = useSports();
  
  if (!sport_id || !sports) return null;
  return sports.find((s) => s.sport_id === sport_id) || null;
}