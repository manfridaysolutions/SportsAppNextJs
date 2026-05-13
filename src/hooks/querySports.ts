import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Sport } from "@/types/sport";

export function querySports() {
  const { key, endpoint } = resources.sports;

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Sport[]>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function querySportById(sport_id: number | null) {
  const { data: sports } = querySports();
  
  if (!sport_id || !sports) return null;
  return sports.find((s) => s.sport_id === sport_id) || null;
}

export function querySportDetail(sport_id: number | null) {
  const { key, endpoint } = resources.sports.detail(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Sport[]>(endpoint),
    enabled: !!sport_id,
    select: (data) => (data.length > 0 ? data[0] : null),
  });
}
