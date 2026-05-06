"use client";

import { useRosters } from "@/hooks/useRosters";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

export function RostersTable({ season_Id, team_Id }: {
  season_Id: number | null;
  team_Id: number | null;
}) {
  const { data: rosters = [], refetch, isLoading } = useRosters(season_Id, team_Id)

  const rosterFields: FieldDef[] = [
    { key: "is_primary_sport", label: "Is Primary Sport", type: "boolean" },
    { key: "status", label: "Status", type: "text" },
    { key: "jersey_number", label: "Jersey Number", type: "text" },
    { key: "athlete.display_name", label: "Athlete", type: "text" },
    { key: "season_id", label: "Season", type: "number", visible: false, defaultValue: season_Id},
    { key: "team_id", label: "Team", type: "number", visible: false, defaultValue: team_Id}
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