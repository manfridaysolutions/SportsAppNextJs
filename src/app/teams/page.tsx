"use client";

import { TeamsTable, REF_REQUIREMENTS_TEAMS } from "@/components/templates/TeamsTable";
import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories";
import { useState } from "react";

import { useSearchParams } from "next/navigation";

const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_TEAMS,
]));

export default function TeamsPage() {
  const searchParams = useSearchParams();

  const league_id = Number(searchParams.get("league_id"));

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Sports Management</h1>
        {(isLoadingRef) && (
          <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
        )}
      </header>

      {/* Main Sports Table Section */}
            <TeamsTable
              league_Id={league_id}
              referenceData={referenceData}
              onSelectTeam={(id) => setSelectedTeamId(id)}
              selectedTeamId={selectedTeamId}
            />
    </div>    
  )
}