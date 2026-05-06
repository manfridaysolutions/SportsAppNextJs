import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Athlete } from "@/types/athlete";

export const API_ENDPOINT = "/api/v1/athlete/";

export function useAthletesBySport(sportId: number | null) {
  return useQuery({
    queryKey: ["athletesBySport", sportId],
    queryFn: () => apiGet<Athlete[]>(`${API_ENDPOINT}by-sport/?sport_id=${sportId}`),
    enabled: !!sportId, // Clean shorthand for sportId !== null
  });
}