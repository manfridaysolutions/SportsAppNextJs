"use client";

import { SportsTable, REF_REQUIREMENTS_SPORTS } from "@/components/templates/SportsTable";
import { LeaguesTable, REF_REQUIREMENTS_LEAGUES } from "@/components/templates/LeaguesTable";
import { PositionsTable } from "@/components/templates/PositionsTable";
import { StatDefinitionsTable, REF_REQUIREMENTS_STAT_DEF} from "@/components/templates/StatDefinitionsTable";
import { useState } from "react";
import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories"

const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_SPORTS,
  ...REF_REQUIREMENTS_LEAGUES,
  ...REF_REQUIREMENTS_STAT_DEF
]));

export default function SportsPage() {
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
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
      <SportsTable
        referenceData={referenceData}
        onSelectSport={(id) => setSelectedSportId(id)}
        selectedId={selectedSportId}
      />

      {/* Dependent Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Positions Column */}
        <PositionsTable
          selectedSportId={selectedSportId}
        />

        {/* Stat Definitions Column */}
        <StatDefinitionsTable
          referenceData={referenceData}
          selectedSportId={selectedSportId}
        />
      </div>
    </div>
  );
}