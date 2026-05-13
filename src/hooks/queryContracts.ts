import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api";
import { resources } from "@/lib/resources"

import { Contract } from "@/types/contract";

export function queryContractsByAthlete(athlete_id: number | null, 
  options?: Partial<UseQueryOptions<Contract[]>>
) {
  const { key, endpoint } = resources.contracts.byAthlete(athlete_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Contract[]>(endpoint),
    ...options,
  });
}

export function queryContractsByTeam(team_id: number | null,
  options?: Partial<UseQueryOptions<Contract[]>>
) {
  const { key, endpoint } = resources.contracts.byTeam(team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Contract[]>(endpoint),
    ...options
  });
}