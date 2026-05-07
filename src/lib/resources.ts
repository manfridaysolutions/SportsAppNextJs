const BASE_URL = "/api/v1";

export const resources = {
  athletes: {
    key: ['athletes'] as const,
    endpoint: `${BASE_URL}/athlete/`,
    bySport: (sportId: number | null) => ({
      key: ['athletes', 'sport', sportId] as const,
      endpoint: `${BASE_URL}/athlete/by-sport/?sport_id=${sportId}`,
    }),
  },
  leagues: {
    key: ['leagues'] as const,
    endpoint: `${BASE_URL}/league/`,
    bySport: (sportId: number | null) => ({
      key: ['leagues', 'sport', sportId] as const,
      endpoint: `${BASE_URL}/league/?sport_id=${sportId}`,
    }),
    bySeason: (seasonId: number | null) => ({
      key: ['leagues', 'season', seasonId] as const,
      endpoint: `${BASE_URL}/league/?season_id=${seasonId}`,
    }),
  },
  positions: {
    key: ['positions'] as const,
    endpoint: `${BASE_URL}/position/`,
    bySport: (sportId: number | null) => ({
      key: ['position', 'sport', sportId] as const,
      endpoint: `${BASE_URL}/position/?sport_id=${sportId}`,
    }),
  },
  referenceCategories: {
    key: ['referenceCategories'] as const,
    endpoint: `${BASE_URL}/reference-categories/`,
        // Identity/Location for the list (e.g., in a dropdown or main table)
    list: () => ({
      key: ['referenceCategories', 'list'] as const,
      endpoint: `${BASE_URL}/reference-categories/`,
    }),
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
    key: ['referenceValues'] as const,
    endpoint: `${BASE_URL}/reference-values/`,
    byCategory: (reference_category_id: number | null) => ({
      key: ['referenceValue', 'referenceCategory', reference_category_id] as const,
      endpoint: `${BASE_URL}/reference-values/?reference_category_id=${reference_category_id}`,
    }),
  },
  rosters: {
    key: ['rosters'] as const,
    endpoint: `${BASE_URL}/roster/`,
    // Identity and Location for the roster filtered by season and team
    bySeasonAndTeam: (seasonId: number | null, teamId: number | null) => ({
      key: ['roster', 'season', seasonId, 'team', teamId] as const,
      endpoint: `${BASE_URL}/roster/?season_id=${seasonId}&team_id=${teamId}`,
    }),
  },
  seasons: {
    key: ['seasons'] as const,
    endpoint: `${BASE_URL}/season/`,
    byLeague: (league_id: number | null) => ({
      key: ['season', 'league', league_id] as const,
      endpoint: `${BASE_URL}/season/?league_id=${league_id}`,
    }),
  },
  sports: {
    // Identity for the entire sports domain
    key: ['sports'] as const,
    endpoint: `${BASE_URL}/sports/`,
    
    // Identity/Location for the list (e.g., in a dropdown or main table)
    list: () => ({
      key: ['sport', 'list'] as const,
      endpoint: `${BASE_URL}/sports/`,
    }),

    // Identity/Location for a specific sport by ID
    detail: (id: number | null) => ({
      key: ['sport', 'detail', id] as const,
      endpoint: `${BASE_URL}/sports/?sport_id=${id}`,
    }),
  },
  statDefinitions: {
    key: ['statDefinitions'] as const,
    endpoint: `${BASE_URL}/season/`,
    bySport: (sport_id: number | null) => ({
      key: ['statDefinition', 'sport_id', sport_id] as const,
      endpoint: `${BASE_URL}/statDefinition/?sport_id=${sport_id}`,
    }),
  },
  teams: {
    key: ['teams'] as const,
    endpoint: `${BASE_URL}/team/`,
    byLeague: (leagueId: number | null) => ({
      key: ['team', 'league', leagueId] as const,
      endpoint: `${BASE_URL}/team/?league_id=${leagueId}`,
    }),
  },
};