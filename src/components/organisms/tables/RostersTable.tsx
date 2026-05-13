"use client";

import { useMemo } from "react";
import { queryRosters, RosterResources } from "@/hooks/queryRosters";
import { queryAthletesByRoster } from "@/hooks/queryAthletes";
import { queryPositions } from "@/hooks/queryPositions";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { Position } from "@/types/position";
import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { Roster } from "@/types/roster";
import { Sport } from "@/types/sport";
import { Badge } from "@/components/ui/badge";

export function RostersTable({ sport, season, team, selectedRoster, onSelectRoster }: {
  sport: Sport | null;
  season: Season | null;
  team: Team | null;
  selectedRoster?: Roster | null;
  onSelectRoster?: (roster: Roster) => void;
}) {
  // 1. Use optional chaining (?.) and provide a fallback ID (null)
  const season_id = season?.season_id ?? null;
  const team_id = team?.team_id ?? null;

  // 2. Your hooks should handle null IDs by returning an empty state or 
  // by using the "enabled" pattern if you are using TanStack Query
  const { data: rawRosters = [], refetch, isLoading } = queryRosters(season_id, team_id);

  const { data: athletes = [] } = queryAthletesByRoster(season_id, team_id);

  const { data: positions = [] } = queryPositions(sport);

  // Flatten nested API data so the table can handle the IDs
  const rosters = useMemo(() => {
    return rawRosters.map(r => ({
      ...r,
      // Create a flat array of IDs for the multi-select editor
      position_ids: r.roster_positions?.map((rp: any) => rp.position_id) || []
    }));
  }, [rawRosters]);

  const rosterFields: FieldDef[] = useMemo(() => [
    {
      key: "athlete_id",
      label: "Athlete",
      type: "select",
      options: athletes.map((a) => ({
        id: a.athlete_id,
        label: a.display_name,
      })),
    },
    { key: "jersey_number", label: "Jersey Number", type: "text" },
    { key: "is_primary_sport", label: "Is Primary Sport", type: "boolean" },
    { key: "status", label: "Status", type: "text" },
    { key: "season_id", label: "Season", type: "number", visible: false, defaultValue: season_id },
    { key: "team_id", label: "Team", type: "number", visible: false, defaultValue: team_id },
    {
      key: "position_ids",
      label: "Positions",
      type: "multi-select",
      editable: false, // Disable editing directly in the roster table, manage via RosterPositionsTable
      options: positions.map((p) => ({
        id: p.position_id,
        label: p.position_name,
      })),
      render: (value: number[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((id) => {
            const pos = positions.find(p => p.position_id === id);
            return (
              <Badge key={id} variant="secondary" className="text-[10px]">
                {/* Fallback here as well for the UI display */}
                {pos?.position_abbreviation ?? `ID: ${id}`}
              </Badge>
            );
          })}
        </div>
      )
    },
  ], [athletes, positions, season_id, team_id]); // Recompute fields when athletes or positions change

  return (
    <BaseDataTable
      title="Roster"
      caption="A list of all sports in the system"
      items={rosters}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField={RosterResources.idField}
      idPlaceholder="hide"
      endpoint={RosterResources.endpoint}
      onRefresh={refetch}
      invalidateKey={RosterResources.bySeasonAndTeam(season_id, team_id).key}
      addLabel="Player"
      fields={rosterFields}
      onSelect={onSelectRoster}
      selectedId={selectedRoster?.roster_id}
      defaultSort={[{ key: "jersey_number", order: "asc" }]}
      itemsPerPage={5}
    />
  );
}