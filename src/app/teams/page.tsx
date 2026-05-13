"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { querySports } from "@/hooks/querySports";
import { querySeasons } from "@/hooks/querySeasons";
import { queryLeaguesDetail } from "@/hooks/queryLeagues";
import { queryReferenceValuesForCategories } from "@/hooks/queryReferences";
import { queryTeams } from "@/hooks/queryTeams";

import { TeamsTable, REF_REQUIREMENTS_TEAMS } from "@/components/organisms/tables/TeamsTable";
import { ContractsTable, REF_REQUIREMENTS_CONTRACTS } from "@/components/organisms/tables/ContractsTable";
import { RostersTable } from "@/components/organisms/tables/RostersTable";
import { SportsSelector } from "@/components/organisms/selectors/SportsSelector";
import { LeaguesSelector } from "@/components/organisms/selectors/LeaguesSelector";
import { TeamsSelector } from "@/components/organisms/selectors/TeamsSelector";
import { SeasonsSelector } from "@/components/organisms/selectors/SeasonsSelector";
import { QuerystringValidator } from "@/components/molecules/QuerystringValidator";

const DYNAMIC_REF_KEYS = Array.from(new Set([
  ...REF_REQUIREMENTS_TEAMS,
  ...REF_REQUIREMENTS_CONTRACTS
]));

export default function TeamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. URL State (Source of Truth)
  const sport_id = searchParams.get("sport_id") ? Number(searchParams.get("sport_id")) : null;
  const league_id = searchParams.get("league_id") ? Number(searchParams.get("league_id")) : null;
  const team_id = searchParams.get("team_id") ? Number(searchParams.get("team_id")) : null;
  const season_id = searchParams.get("season_id") ? Number(searchParams.get("season_id")) : null;

  // 2. Data Fetching
  const { data: sports, isLoading: isInitialLoading } = querySports(); // Check global loading
  const { data: league, isLoading: isLoadingLeague } = queryLeaguesDetail(league_id);
  const { data: teams = [], isLoading: isLoadingTeams } = queryTeams(league_id);
  const { data: seasons = [], isLoading: isLoadingSeasons } = querySeasons(league_id);
  const { data: referenceData = {}, isLoading: isLoadingRef } = queryReferenceValuesForCategories(DYNAMIC_REF_KEYS);

  // 3. Derived State (finding objects based on URL IDs)
  const selectedSport = useMemo(() =>
    sports?.find(s => s.sport_id === sport_id) || null,
    [sports, sport_id]);

  const selectedTeam = useMemo(() =>
    teams.find(t => t.team_id === team_id) || null,
    [teams, team_id]);

  const selectedSeason = useMemo(() => {
    // If we have a specific ID in the URL, find it
    if (season_id) return seasons.find(s => s.season_id === season_id) || null;

    // Fallback: Default Season logic (Current/Upcoming or Absolute Latest)
    if (seasons.length === 0) return null;
    const today = new Date();
    const activeSeasons = seasons
      .filter(s => new Date(s.end_date) >= today)
      .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());

    return activeSeasons.length > 0 ? activeSeasons[0] : [...seasons].sort((a, b) =>
      new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
    )[0];
  }, [seasons, season_id]);

  // 4. Navigation Handlers
  const handleUpdateQuery = (key: string, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value.toString());
    router.push(`?${params.toString()}`);
  };

  const isSyncing = isLoadingTeams || isLoadingSeasons || isLoadingRef;

  return (
    <QuerystringValidator
      id={league_id}
      data={league}
      isLoading={isLoadingLeague}
      entityName="League"
      returnPath="/sports"
    >
      <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Sports Management</h1>
          {isSyncing && (
            <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
          )}
        </header>
        <table>
          <tbody>
            <tr>
              <td>
                <SportsSelector
                  selectedSport={selectedSport}
                  onSelect={(s) => router.push(`/teams?sport_id=${s.sport_id}`)}
                />
              </td>
              <td>
                <LeaguesSelector
                  sport={selectedSport}
                  selectedLeague={league}
                  onSelect={(l) => router.push(`/teams?league_id=${l.league_id}&sport_id=${selectedSport?.sport_id}`)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <TeamsTable
          league={league!}
          referenceData={referenceData}
          onSelectTeam={(t) => handleUpdateQuery("team_id", t.team_id)}
          selectedTeam={selectedTeam}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <ContractsTable
            team={selectedTeam}
            referenceData={referenceData}
          />

          <div className="space-y-6">
            <div className="flex gap-4">
              <TeamsSelector
                league={league}
                selectedTeam={selectedTeam}
                onSelect={(t) => handleUpdateQuery("team_id", t.team_id)}
              />
              <SeasonsSelector
                league={league}
                selectedSeason={selectedSeason}
                onSelect={(s) => handleUpdateQuery("season_id", s.season_id)}
              />
            </div>

            <RostersTable
              season={selectedSeason}
              team={selectedTeam}
            />
          </div>
        </div>
      </div>
    </QuerystringValidator>
  );
}