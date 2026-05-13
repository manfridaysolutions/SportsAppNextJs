// src/components/auth/QuerystringValidator.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface QuerystringValidatorProps<T> {
  id: number | null;
  data: T | null | undefined;
  isLoading: boolean;
  entityName: string; // e.g., "Sport", "League", "Team"
  returnPath: string; // e.g., "/sports"
  children: React.ReactNode;
}

export function QuerystringValidator<T>({
  id,
  data,
  isLoading,
  entityName,
  returnPath,
  children
}: QuerystringValidatorProps<T>) {
  const router = useRouter();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-sm text-muted-foreground animate-pulse">
          Validating {entityName}...
        </span>
      </div>
    );
  }

  // 2. Error State: ID is missing, NaN, or record doesn't exist in cache/DB
  if (id !== null && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Invalid {entityName} Selected</h2>
        <p className="text-muted-foreground">
          The {entityName.toLowerCase()} you are looking for does not exist or the ID is invalid.
        </p>
        <Button onClick={() => router.push(returnPath)}>
          Return to {entityName} List
        </Button>
      </div>
    );
  }

  // 3. Success State
  return <>{children}</>;
}