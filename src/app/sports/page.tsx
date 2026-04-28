"use client";

import { useReferenceValues } from "@/hooks/useReferenceValues";

import { SportsTable } from "@/components/templates/SportsTable";
import { LeaguesTable } from "@/components/templates/LeaguesTable";
import { apiGet } from "@/lib/api";
import { Sport } from "@/types/sport";
import { League } from "@/types/league";
import { useState, useEffect } from "react";

export default function SportsPage() {

  const [sports_get, setSports] = useState<Sport[]>([]);
  const [leagues_get, setLeagues] = useState<League[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true);

  // This is your onRefresh function
  const fetchLeagues = async () => {
    if (!selectedSportId) return;
    const data = await apiGet<League[]>(`/api/v1/league/?sport_id=${selectedSportId}`);
    setLeagues(data);
  };

  // 2. Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsData, leaguesData] = await Promise.all([
          apiGet<Sport[]>("/api/v1/sports/"),
          apiGet<League[]>("/api/v1/league/")
        ]);

        setSports(sportsData);
        setLeagues(leaguesData);
      } catch (error) {
        console.error("Failed to fetch sports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Filter logic for the child table
  const filteredLeagues = selectedSportId 
    ? leagues_get.filter((league) => league.sport_id === selectedSportId)
    : [];

  const { data, isLoading } = useReferenceValues([
    "AssetType",
    "TradeStatus",
    "Country",
  ]);

  // Transform the array into a lookup object
  // Convert to 'unknown' then 'any[]' to bypass the overlap check
  const referenceData = (data as unknown as any[])?.reduce((acc, category) => {
    // category.name is "Country", "AssetType", etc.
    // category.reference_values is the array of options
    acc[category.name] = category.reference_values;
    return acc;
  }, {} as Record<string, any[]>) || {};

  if (loading || !data) return <div className="p-6">Loading sportsapp data...</div>;

  return (
    <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">
        Sports
      </h1>
      
      {/* 4. Pass the setter to the SportsTable to capture selection */}
      <SportsTable 
        referenceData={referenceData}
        sports={sports_get} 
        onSelectSport={(id) => setSelectedSportId(id)} 
        selectedId={selectedSportId}
      />

      <h1 className="text-2xl font-semibold mt-8 mb-4 tracking-tight">
        Leagues
      </h1>
      
      {/* 5. Pass only the filtered leagues to the second table */}
      <LeaguesTable
        referenceData={referenceData}
        leagues={filteredLeagues}
        onRefresh={fetchLeagues} 
        selectedSportId={selectedSportId} // NEW: pass selectedSportId to LeaguesTable
        />
    </div>
  );
}