"use client";

import { useState } from "react";
import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories"

import { LeaguesTable, REF_REQUIREMENTS_LEAGUES } from "@/components/templates/LeaguesTable";
import { TeamsTable, REF_REQUIREMENTS_TEAMS } from "@/components/templates/TeamsTable";
import { SeasonsTable } from "@/components/templates/SeasonsTable";

import { League } from "@/types/league"

import { useSearchParams } from "next/navigation";
import { useSportById } from "@/hooks/useSports";

const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_LEAGUES,
  ...REF_REQUIREMENTS_TEAMS
]));

export default function LeaguesPage() {
  const searchParams = useSearchParams();

  const sport_id = Number(searchParams.get("sport_id"));

  const sport = useSportById(sport_id);

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">League Management</h1>
        {(isLoadingRef) && (
          <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
        )}
      </header>

      <LeaguesTable
        referenceData={referenceData}
        sport={sport}
        onSelectLeague={(league) => setSelectedLeague(league)}
        selectedLeague={selectedLeague}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <TeamsTable
          league={selectedLeague}
          referenceData={referenceData}
        />

        <SeasonsTable
          league={selectedLeague}
        />
      </div>
    </div>
  );
}