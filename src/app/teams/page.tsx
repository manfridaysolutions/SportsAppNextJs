"use client";

import { ModelSelector } from "@/components/molecules/ModelSelector";
import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories";
import { useTeams } from "@/hooks/useTeams";
import { useSeasons } from "@/hooks/useSeasons";
import { useState, useEffect } from "react";
import { RostersTable } from "@/components/templates/RostersTable";

import { useSearchParams } from "next/navigation";

const DYNAMIC_REF_KEYS = Array.from(new Set([
]));

export default function TeamsPage() {
  const searchParams = useSearchParams();

  const league_id = Number(searchParams.get("league_id"));

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

  const { data: teams = [], refetch: refetchTeams, isLoading: isLoadingTeams } = useTeams(league_id);
  const { data: seasons = [], refetch: refetchSeasons, isLoading: isLoadingSeasons } = useSeasons(league_id);

  useEffect(() => {
    if (seasons.length > 0 && !selectedSeasonId) {
      const today = new Date();

      // 1. Filter for seasons that haven't ended yet
      // 2. Sort by end_date so we can pick the "closest" or "last" one
      const activeSeasons = seasons
        .filter(s => new Date(s.end_date) >= today)
        .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());

      if (activeSeasons.length > 0) {
        // Pick the first one in the sorted 'future' list (the current/upcoming one)
        setSelectedSeasonId(activeSeasons[0].season_id);
      } else if (seasons.length > 0) {
        // Fallback: If all seasons are in the past, pick the absolute latest one
        const latestSeason = [...seasons].sort((a, b) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        )[0];
        setSelectedSeasonId(latestSeason.season_id);
      }
    }
  }, [seasons, selectedSeasonId]);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Sports Management</h1>
        {(isLoadingRef) && (
          <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
        )}
      </header>

      <ModelSelector
        items={teams}
        selectedId={selectedTeamId}
        onSelect={(id) => setSelectedTeamId(id)}
        idKey="team_id"
        labelKey="team_name"
        placeholder="Select Team"
      />

      <ModelSelector
        items={seasons}
        selectedId={selectedSeasonId}
        onSelect={(id) => setSelectedSeasonId(id)}
        idKey="season_id"
        labelKey="season_year"
        sortBy="start_date"
        sortOrder="desc"
        placeholder="Select Season"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RostersTable
          season_Id ={selectedSeasonId}
          team_Id={selectedTeamId}
        />
      </div>
    </div>
  )
}