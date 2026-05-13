"use client";

import { useState } from "react";
import { queryReferenceValuesForCategories } from "@/hooks/queryReferences";

import { SportsTable, REF_REQUIREMENTS_SPORTS } from "@/components/organisms/tables/SportsTable";
import { PositionsTable } from "@/components/organisms/tables/PositionsTable";
import { StatDefinitionsTable, REF_REQUIREMENTS_STAT_DEF} from "@/components/organisms/tables/StatDefinitionsTable";

import { Sport } from "@/types/sport"

const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_SPORTS,
  ...REF_REQUIREMENTS_STAT_DEF
]));

export default function SportsPage() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  const { data: referenceData = {}, isLoading: isLoadingRef } = queryReferenceValuesForCategories(DYNAMIC_REF_KEYS);

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
        onSelectSport={(sport) => setSelectedSport(sport)}
        selectedSport={selectedSport}
      />

      {/* Dependent Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Positions Column */}
        <PositionsTable
          sport={selectedSport}
        />

        {/* Stat Definitions Column */}
        <StatDefinitionsTable
          referenceData={referenceData}
          sport={selectedSport}
        />
      </div>
    </div>
  );
}