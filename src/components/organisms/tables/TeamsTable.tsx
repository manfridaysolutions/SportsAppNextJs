"use client";

import { resources } from "@/lib/resources";
import { queryTeams } from "@/hooks/queryTeams";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";

import { Team } from "@/types/team"
import { League } from "@/types/league"

export const REF_REQUIREMENTS_TEAMS = ["City","StateProvince","Country","Venue"];

export function TeamsTable({ league, referenceData, selectedTeam, onSelectTeam }: {
  league: League | null;
  referenceData: Record<string, any[]>;
  selectedTeam?: Team | null;
  onSelectTeam?: (team: Team) => void;
}) {
  const league_id = league?.league_id ?? null;

  const { data: teams = [], refetch, isLoading } = queryTeams(league_id);

  const cities = referenceData?.["City"] ?? [];
  const states_provinces = referenceData?.["StateProvince"] ?? [];
  const countries = referenceData?.["Country"] ?? [];
  const venues = referenceData?.["Venue"] ?? [];

  const teamFields: FieldDef[] = [
    { key: "team_name", label: "Team Name", type: "text" },
    { key: "short_name", label: "Short Team Name", type: "text" },
    { key: "abbreviation", label: "Abbreviation", type: "text" },
    {
      key: "city_id",
      label: "City",
      type: "select",
      options: cities.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    {
      key: "state_province_id",
      label: "State-Province",
      type: "select",
      options: states_provinces.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    {
      key: "country_id",
      label: "Country",
      type: "select",
      options: countries.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    {
      key: "venue_id",
      label: "Venue",
      type: "select",
      options: venues.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    { key: "primary_color", label: "Primary Color", type: "text" },
    { key: "secondary_color", label: "Secondary Color", type: "text" },
    { key: "logo_url", label: "Logo URL", type: "text" },
    { key: "founded_year", label: "Founded Year", type: "number"},
    {
      key: "is_active",
      label: "Is Active",
      type: "boolean",
      defaultValue: 1,
    },
    { key: "league_id", label: "League", type: "number", visible: false, defaultValue: league_id}
  ];

return (
    <BaseDataTable
      title="Teams"
      caption="A list of all sports in the system"
      items={teams}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField={resources.teams.idField}
      idPlaceholder="hide"
      endpoint={resources.teams.endpoint}
      onRefresh={refetch}
      invalidateKey={resources.teams.byLeague(league_id).key}    // Specific key for this list
      addLabel="Team"
      fields={teamFields}
      defaultSort={[
        { key: "team_name", order: "asc" }
      ]}
      selectedId={selectedTeam?.team_id}
      onSelect={onSelectTeam}
   />
  );
}