import { useQuery } from "@tanstack/react-query";
import { fetchReferenceValues } from "@/types/referencevalue";

export function useReferenceValues(names: string[]) {
  return useQuery({
    queryKey: ["reference-values", names],
    queryFn: () => fetchReferenceValues(names),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
