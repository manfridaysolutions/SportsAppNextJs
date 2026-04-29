"use client";

import { useReferenceValues } from "@/hooks/useReferenceValues";
import { SportsTable } from "@/components/templates/SportsTable";
import { LeaguesTable } from "@/components/templates/LeaguesTable";
import { apiGet } from "@/lib/api";
import { Sport } from "@/types/sport";
import { League } from "@/types/league";
import { useState, useEffect, useCallback } from "react";

export default function SportsPage() {
  const [sports_get, setSports] = useState<Sport[]>([]);
  const [leagues_get, setLeagues] = useState<League[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // --- REFRESH LOGIC FOR SPORTS ---
  const fetchSports = async () => {
    try {
      const sportsData = await apiGet<Sport[]>("/api/v1/sports/");
      setSports(sportsData);
    } catch (error) {
      console.error("Failed to refresh sports:", error);
    }
  };

  // --- REFRESH LOGIC FOR LEAGUES ---
  const fetchLeagues = useCallback(async (id: number | null) => {
    // Use a strict null/undefined check
    if (id === null || id === undefined) {
      setLeagues([]);
      return;
    }

    try {
      const data = await apiGet<League[]>(`/api/v1/league/?sport_id=${id}`);
      setLeagues(data);
    } catch (error) {
      console.error("Failed to fetch leagues:", error);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    const init = async () => {
      await fetchSports();
      setLoading(false);
    };
    init();
  }, []);

  // On-Demand League Fetching
  useEffect(() => {
    fetchLeagues(selectedSportId);
  }, [selectedSportId, fetchLeagues]);

  const { data } = useReferenceValues(["SportCategory", "Country"]);

  const referenceData = (data as unknown as any[])?.reduce((acc, category) => {
    acc[category.name] = category.reference_values;
    return acc;
  }, {} as Record<string, any[]>) || {};

  if (loading || !data) return <div className="p-6">Loading sportsapp data...</div>;

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">Sports</h1>

      <SportsTable
        referenceData={referenceData}
        sports={sports_get}
        onSelectSport={(id) => setSelectedSportId(id)}
        selectedId={selectedSportId}
        onRefresh={fetchSports} // 👈 Passed to SportsTable for Edit/Create success
      />

      <h1 className="text-2xl font-semibold mt-8 mb-4 tracking-tight">Leagues</h1>

      <LeaguesTable
        referenceData={referenceData}
        leagues={leagues_get}
        onRefresh={() => fetchLeagues(selectedSportId)}
        selectedSportId={selectedSportId}
      />
    </div>
  );
}