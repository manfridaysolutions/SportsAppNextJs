"use client";

import { queryRosterPositions, RosterPositionResources } from "@/hooks/queryRosterPositions";
import { queryPositions } from "@/hooks/queryPositions";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { Roster } from "@/types/roster";
import { Sport } from "@/types/sport";

export function RostersPositionTable({ sport, roster, invalidateParentKey }: {
  sport: Sport | null;
  roster: Roster | null;
  invalidateParentKey: readonly any[];
}) {
  // Needs to remain for setting the default roster_id when creating a new roster position
  const roster_id = roster?.roster_id ?? null;

  // 2. Your hooks should handle null IDs by returning an empty state or 
  // by using the "enabled" pattern if you are using TanStack Query
  const { data: rosterPositions = [], refetch, isLoading: rosterPositionsLoading } = queryRosterPositions(roster);

  const { data: positions = [], isLoading: positionsLoading } = queryPositions(sport)

  const rosterPositionFields: FieldDef[] = [
    { key: "is_starting_role", label: "Is Starting Role", type: "boolean" },
    { key: "snap_count_percentage", label: "Snap Count Percentage", type: "number" },
    { key: "roster_id", label: "Roster", type: "number", visible: false, defaultValue: roster_id },
    {
      key: "position_id",
      label: "Position",
      type: "select",
      options: positions.map((p) => ({
        id: p.position_id,
        label: p.position_name,
      }))
    },
  ]

  return (
    <BaseDataTable
      title="Roster Positions"
      caption="A list of all sports in the system"
      items={rosterPositions}
      isLoading={rosterPositionsLoading || positionsLoading} // Assuming sports are passed in as props, loading handled by parent
      idField={RosterPositionResources.idField}
      idPlaceholder="hide"
      endpoint={RosterPositionResources.endpoint}
      onRefresh={refetch}
      invalidateKey={[
        RosterPositionResources.byRoster(roster).key, // Refresh this table
        invalidateParentKey                          // Refresh the Roster table above
      ]}
      addLabel="Position"
      fields={rosterPositionFields}
    />
  );
}