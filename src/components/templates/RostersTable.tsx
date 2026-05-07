"use client";

import { useRosters } from "@/hooks/useRosters";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";
import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { useSports } from "@/hooks/useSports";
import { usePositions } from "@/hooks/usePositions";

export function RostersTable({ season, team }: {
  season: Season | null;
  team: Team | null;
}) {
  // 1. Use optional chaining (?.) and provide a fallback ID (null)
  const season_id = season?.season_id ?? null;
  const team_id = team?.team_id ?? null;

  // 2. Your hooks should handle null IDs by returning an empty state or 
  // by using the "enabled" pattern if you are using TanStack Query
  const { data: rosters = [], refetch, isLoading } = useRosters(season_id, team_id);
  
  const rosterFields: FieldDef[] = [
    { key: "is_primary_sport", label: "Is Primary Sport", type: "boolean" },
    { key: "status", label: "Status", type: "text" },
    { key: "jersey_number", label: "Jersey Number", type: "text" },
    { key: "athlete.display_name", label: "Athlete", type: "text" },
    { key: "season_id", label: "Season", type: "number", visible: false, defaultValue: season_id},
    { key: "team_id", label: "Team", type: "number", visible: false, defaultValue: team_id}
  ];

return (
    <BaseDataTable
      title="Roster"
      caption="A list of all sports in the system"
      items={rosters}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="roster_id"
      idPlaceholder="hide"
      endpoint="/api/v1/roster/"
      onRefresh={refetch}
      addLabel="Player"
      fields={rosterFields}
   />
  );
}