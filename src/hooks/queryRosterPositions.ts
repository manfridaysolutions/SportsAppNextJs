import { useQuery } from "@tanstack/react-query";

import { apiGet, BASE_URL } from "@/lib/api";
import { Roster } from "@/types/roster";
import { RosterPosition } from "@/types/rosterposition";

export const RosterPositionResources = {
    idField: 'roster_position_id',
    key: ['roster_positions'] as const,
    endpoint: `${BASE_URL}/roster_positions/`,
    // Identity and Location for the roster position filtered by season and team
    byRoster: (roster: Roster | null) => ({
      key: ['rosterposition', 'roster', roster?.roster_id] as const,
      endpoint: `${BASE_URL}/roster_positions/?roster_id=${roster?.roster_id}`,
    }),
}

export function queryRosterPositions(roster: Roster | null) {
  const { key, endpoint } = RosterPositionResources.byRoster(roster);

  return useQuery({
    queryKey: key,
    queryFn: () => apiGet<RosterPosition[]>(endpoint),
    enabled: !!roster,
  });
}