import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { apiGet, BASE_URL } from "@/lib/api";

import { Contract } from "@/types/contract";

export const ContractResources = {
  idField: 'contract_id',
  key: ['contracts'] as const,
  endpoint: `${BASE_URL}/contract/`,
  byAthlete: (athlete_id: number | null) => ({
    key: ['contract', 'athlete', athlete_id] as const,
    endpoint: `${BASE_URL}/contract/?athlete_id=${athlete_id}`,
  }),
  byTeam: (team_id: number | null) => ({
    key: ['contract', 'team', team_id] as const,
    endpoint: `${BASE_URL}/contract/?team_id=${team_id}`,
  })
}

export function queryContractsByAthlete(athlete_id: number | null,
  options?: Partial<UseQueryOptions<Contract[]>>
) {
  const { key, endpoint } = ContractResources.byAthlete(athlete_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Contract[]>(endpoint),
    ...options,
  });
}

export function queryContractsByTeam(team_id: number | null,
  options?: Partial<UseQueryOptions<Contract[]>>
) {
  const { key, endpoint } = ContractResources.byTeam(team_id);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<Contract[]>(endpoint),
    ...options
  });
}