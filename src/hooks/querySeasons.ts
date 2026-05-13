import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Season } from "@/types/season";

export function querySeasons(league_id: number | null) {
  const { key, endpoint } = resources.seasons.byLeague(league_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Season[]>(endpoint),
    enabled: !!league_id
  });
}
