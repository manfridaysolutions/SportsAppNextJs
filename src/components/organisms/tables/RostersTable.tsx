"use client";

import { queryRosters, RosterResources } from "@/hooks/queryRosters";
import { queryAthletesByRoster } from "@/hooks/queryAthletes";
import { queryPositions } from "@/hooks/queryPositions";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { Position } from "@/types/position";
import { League } from "@/types/league";
import { Season } from "@/types/season";
import { Team } from "@/types/team";

export function RostersTable({ league, season, team }: {
  league?: League | null;
  season: Season | null;
  team: Team | null;
}) {
  // 1. Use optional chaining (?.) and provide a fallback ID (null)
  const season_id = season?.season_id ?? null;
  const team_id = team?.team_id ?? null;

  // 2. Your hooks should handle null IDs by returning an empty state or 
  // by using the "enabled" pattern if you are using TanStack Query
  const { data: rosters = [], refetch, isLoading } = queryRosters(season_id, team_id);

  const { data: athletes = [] } = queryAthletesByRoster(season_id, team_id);

  const { data: positions = [] } = queryPositions(league?.sport_id ?? null);

  const rosterFields: FieldDef[] = [
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
      key: "roster_positions", 
      label: "Positions", 
      type: "multi-select",
      options: positions.map((p) => ({
        id: p.position_id,
        label: p.position_name,
      }))
    },
  ];

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
    />
  );
}