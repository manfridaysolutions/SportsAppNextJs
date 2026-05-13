const BASE_URL = "/api/v1";

export const resources = {
  leagues: {
    idField: 'league_id',
    key: ['leagues'] as const,
    endpoint: `${BASE_URL}/league/`,
    bySport: (sport_id: number | null) => ({
      key: ['league', 'sport', sport_id] as const,
      endpoint: `${BASE_URL}/league/?sport_id=${sport_id}`,
    }),
    bySeason: (season_id: number | null) => ({
      key: ['league', 'season', season_id] as const,
      endpoint: `${BASE_URL}/league/?season_id=${season_id}`,
    }),
    // Identity/Location for a specific sport by ID
    detail: (league_id: number | null) => ({
      key: ['league', 'detail', league_id] as const,
      endpoint: `${BASE_URL}/league/?league_id=${league_id}`,
    }),
  },
  positions: {
    idField: 'position_id',
    key: ['positions'] as const,
    endpoint: `${BASE_URL}/position/`,
    bySport: (sport_id: number | null) => ({
      key: ['position', 'sport', sport_id] as const,
      endpoint: `${BASE_URL}/position/?sport_id=${sport_id}`,
    }),
  },
  referenceCategories: {
    idField: 'reference_category_id',
    key: ['referenceCategories'] as const,
    endpoint: `${BASE_URL}/reference-categories/`,
    // New Resource for fetching multiple categories by name
    byNames: (names: string[]) => ({
      // We sort the names to ensure the queryKey is stable regardless of array order
      key: ['referenceCategories', 'by-names', [...names].sort()] as const,
      endpoint: `${BASE_URL}/reference-categories/by-names/?${names
        .map((n) => `names=${encodeURIComponent(n)}`)
        .join("&")}`,
    }),
  },
  referenceValues: {
    idField: 'reference_value_id',
    key: ['referenceValues'] as const,
    endpoint: `${BASE_URL}/reference-values/`,
    byCategory: (reference_category_id: number | null) => ({
      key: ['referenceValue', 'referenceCategory', reference_category_id] as const,
      endpoint: `${BASE_URL}/reference-values/?reference_category_id=${reference_category_id}`,
    }),
  },
  seasons: {
    idField: 'season_id',
    key: ['seasons'] as const,
    endpoint: `${BASE_URL}/season/`,
    byLeague: (league_id: number | null) => ({
      key: ['season', 'league', league_id] as const,
      endpoint: `${BASE_URL}/season/?league_id=${league_id}`,
    }),
  },
  sports: {
    idField: 'sport_id',
    key: ['sports'] as const,
    endpoint: `${BASE_URL}/sports/`,

    // Identity/Location for a specific sport by ID
    detail: (id: number | null) => ({
      key: ['sport', 'detail', id] as const,
      endpoint: `${BASE_URL}/sports/?sport_id=${id}`,
    }),
  },
  statDefinitions: {
    idField: 'stat_def_id',
    key: ['statDefinitions'] as const,
    endpoint: `${BASE_URL}/season/`,
    bySport: (sport_id: number | null) => ({
      key: ['statDefinition', 'sport_id', sport_id] as const,
      endpoint: `${BASE_URL}/statDefinition/?sport_id=${sport_id}`,
    }),
  },
  teams: {
    idField: 'team_id',
    key: ['teams'] as const,
    endpoint: `${BASE_URL}/team/`,
    byLeague: (league_id: number | null) => ({
      key: ['team', 'league', league_id] as const,
      endpoint: `${BASE_URL}/team/?league_id=${league_id}`,
    }),
  },
};