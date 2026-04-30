"use client";

import { SportsTable } from "@/components/templates/SportsTable";
import { LeaguesTable } from "@/components/templates/LeaguesTable";
import { PositionsTable } from "@/components/templates/PositionsTable";
import { useState } from "react";
import { useSports } from "@/hooks/useSports"
import { useLeagues } from "@/hooks/useLeagues"
import { usePositions } from "@/hooks/usePositions"
import { useReferenceValues } from "@/hooks/useReferenceValues"

const REF_KEYS = ["SportCategory", "Country"];

export default function SportsPage() {
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

  const { data: sports = [], refetch: refetchSports, isLoading: isLoadingSports } = useSports();
  const { data: leagues = [],  refetch: refetchLeagues, isLoading: isLoadingLeagues } = useLeagues(selectedSportId);
  const { data: positions = [], refetch: refetchPositions, isLoading: isLoadingPositions } = usePositions(selectedSportId);

  // 4. Reference Data Logic
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValues(REF_KEYS);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Sports Management</h1>
        {(isLoadingSports || isLoadingRef) && (
          <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
        )}
      </header>

      {/* Main Sports Table Section */}
      <section>
        {isLoadingSports ? (
          <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
            <p className="text-sm opacity-50">Loading sports list...</p>
          </div>
        ) : (
          <SportsTable
            sports={sports}
            referenceData={referenceData}
            onSelectSport={(id) => setSelectedSportId(id)}
            selectedId={selectedSportId}
            onRefresh={() => refetchSports()}
          />
        )}
      </section>

      {/* Dependent Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Leagues Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Leagues</h2>
          <LeaguesTable
            referenceData={referenceData}
            leagues={leagues}
            onRefresh={() => refetchLeagues()}
            selectedSportId={selectedSportId}
          />
          {isLoadingLeagues && (
            <p className="text-xs text-blue-500 animate-pulse">Fetching leagues...</p>
          )}
        </div>

        {/* Positions Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Positions</h2>
          <PositionsTable
            positions={positions}
            onRefresh={() => refetchPositions()}
            selectedSportId={selectedSportId}
          />
          {isLoadingPositions && (
            <p className="text-xs text-blue-500 animate-pulse">Fetching positions...</p>
          )}
        </div>

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