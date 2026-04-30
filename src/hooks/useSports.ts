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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}