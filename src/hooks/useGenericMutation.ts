import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { apiSave, apiDelete } from "@/lib/api";

interface MutationParams<T> {
  path: string;
  method: "POST" | "PUT" | "DELETE";
  data?: Partial<T>; // Made optional for DELETE requests
}

export function useGenericMutation<T>(
  invalidateKey?: readonly any[] | readonly (readonly any[])[],
  options?: UseMutationOptions<T, Error, MutationParams<T>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, method, data }: MutationParams<T>) => {
      if (method === "DELETE") {
        await apiDelete(path);
        return {} as T;
      }
      return apiSave<T>(path, method, data || {});
    },

    onSuccess: async (...args) => {
      const [data, variables, context] = args;
      if (invalidateKey) {
        // 1. Log to your browser console so you can see the "Live" key being used
        console.log("Mutation Success. InvalidateKey provided:", invalidateKey);

        // 2. Identify if we have multiple keys or just one
        // We want to ensure we have an array of arrays: [ [key1], [key2] ]
        const finalKeys = Array.isArray(invalidateKey[0])
          ? invalidateKey
          : [invalidateKey];

        const promises = finalKeys.map((key) => {
          console.log("📡 Invalidation triggered for:", key);
          return queryClient.invalidateQueries({
            queryKey: key as any,
            exact: false, // Helps match even if types (string vs number) are slightly off
            refetchType: 'active'
          });
        });

        await Promise.all(promises);
      }

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    }
  })
};