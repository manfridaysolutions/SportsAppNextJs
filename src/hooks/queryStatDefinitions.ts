import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { StatDefinition } from "@/types/statDefinition";

export function queryStatDefinitions(sport_id: number | null) {
  const { key, endpoint } = resources.statDefinitions.bySport(sport_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<StatDefinition[]>(endpoint),
    enabled: !!sport_id, // Clean shorthand for sportId !== null
  });
}
