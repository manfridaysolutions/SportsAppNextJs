"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { QuerystringValidator } from "@/components/molecules/QuerystringValidator";
import { LeaguesTable, REF_REQUIREMENTS_LEAGUES } from "@/components/templates/LeaguesTable";
import { TeamsTable, REF_REQUIREMENTS_TEAMS } from "@/components/templates/TeamsTable";
import { SeasonsTable } from "@/components/templates/SeasonsTable";

import { League } from "@/types/league"
import { Sport } from "@/types/sport";

import { useSports, useReferenceValuesForCategories } from "@/hooks/useQuery"
import { SportsSelector } from "@/components/organisms/selectors/SportsSelector";



const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_LEAGUES,
  ...REF_REQUIREMENTS_TEAMS
]));

export default function LeaguesPage() {
  const router = useRouter(); // Initialize router

  const searchParams = useSearchParams();
  const sport_id = searchParams.get("sport_id") ? Number(searchParams.get("sport_id")) : null;

  const { data: sports, isLoading: isInitialLoading } = useSports(); // Check global loading
  const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const sport = useMemo(() => {
    if (!sports || !sport_id) return null;
    return sports.find((s) => s.sport_id === sport_id) || null;
  }, [sports, sport_id]);

  const handleSportChange = (sport: Sport) => {
    router.push(`/leagues?sport_id=${sport.sport_id}`);
  };

  return (
    <QuerystringValidator
      id={sport_id}
      data={sport}
      isLoading={isInitialLoading}
      entityName="Sport"
      returnPath="/sports"
    >
      <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">League Management</h1>
          {(isLoadingRef) && (
            <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
          )}
        </header>

        <SportsSelector
          selectedSport={sport}
          onSelect={handleSportChange}
        />

        <LeaguesTable
          referenceData={referenceData}
          sport={sport ?? null}
          onSelectLeague={setSelectedLeague}
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
    </QuerystringValidator>
  );
}