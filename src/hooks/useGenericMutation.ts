import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { apiSave } from "@/lib/api";

interface MutationParams<T> {
  path: string;
  method: "POST" | "PUT";
  data: Partial<T>;
}

export function useGenericMutation<T>(
  invalidateKey?: readonly any[], 
  options?: UseMutationOptions<T, Error, MutationParams<T>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ path, method, data }: MutationParams<T>) => 
      apiSave<T>(path, method, data),
    
    // Updated to accept 4 arguments: data, variables, context, and the rollup/result
    onSuccess: (data, variables, context, mutationResult) => {
      // 1. Handle our generic cache invalidation
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
      
      // 2. Safely call the custom onSuccess if passed in via options
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutationResult);
      }
    },
    ...options,
  });
}