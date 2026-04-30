"use client";

import { SportsTable } from "@/components/templates/SportsTable";
import { LeaguesTable } from "@/components/templates/LeaguesTable";
import { PositionsTable } from "@/components/templates/PositionsTable";
import { useState } from "react";
import { usePositions } from "@/hooks/usePositions"
import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories"

const REF_KEYS = ["SportCategory", "Country"];

export default function SportsPage() {
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(REF_KEYS);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Leagues Column */}
        <LeaguesTable
          referenceData={referenceData}
          selectedSportId={selectedSportId}
        />

        {/* Positions Column */}
        <PositionsTable
          selectedSportId={selectedSportId}
        />

        {/* Stat Definitions Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Stat Definitions</h2>
          {!selectedSportId && (
            <p className="text-sm text-muted-foreground italic">Select a sport to view stats</p>
          )}
        </div>
      </div>
    </div>
  );
}