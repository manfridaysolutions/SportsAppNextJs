"use client";

import { queryContractsByAthlete, queryContractsByTeam, ContractResources } from "@/hooks/queryContracts";
import { queryAthletesBySport } from "@/hooks/queryAthletes";
import { querySeasons } from "@/hooks/querySeasons";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { League } from "@/types/league";
import { Athlete } from "@/types/athlete";
import { Team } from "@/types/team";

export const REF_REQUIREMENTS_CONTRACTS = ["ContractType"];

export function ContractsTable({ league, athlete, team, referenceData }: {
  league?: League | null;
  athlete?: Athlete | null;
  team?: Team | null;
  referenceData: Record<string, any[]>;
}) {
  const athlete_id = athlete?.athlete_id ?? null;
  const team_id = team?.team_id ?? null;

  // Use the athlete hook if we have an ID, otherwise fall back to the team hook
  // We call both, but only "enable" the one we actually need

  const { data: seasons = [] } = querySeasons(league?.league_id ?? null); // For potential future use in filtering or default season logic

  // Simply pick the result set we want to use
  const { data: contracts = [], isLoading, refetch } = athlete_id 
    ? queryContractsByAthlete(athlete_id, { enabled: !!athlete_id })
    : queryContractsByTeam(team_id, { enabled: !athlete_id && !!team_id });

  const { data: athletes = [], isLoading: isLoadingAthletes } = queryAthletesBySport(league?.sport_id ?? null);

  const contractFields: FieldDef[] = [
    {
      key: "athlete_id",
      label: "Athlete",
      type: "select",
      options: athletes.map((a) => ({
        id: a.athlete_id,
        label: a.display_name,
      })),
      defaultValue: athlete_id,
      visible: !!team_id // Only show athlete selector when we're looking at team contracts
    },
    {
      key: "start_season_id",
      label: "Start Season",
      type: "select",
      options: seasons.map((s) => ({
        id: s.season_id,
        label: s.season_year,
      }))
    },
    {
      key: "end_season_id",
      label: "End Season",
      type: "select",
      options: seasons.map((s) => ({
        id: s.season_id,
        label: s.season_year,
      }))
    },
    { key: "team_id", label: "Team", type: "number", visible: !!athlete_id, defaultValue: team_id },
    { key: "signed_date", label: "Signed Date", type: "date" },
    { key: "total_value", label: "Total Value", type: "number" },
    { key: "guaranteed_amount", label: "Guaranteed Amount", type: "text" },
    {
      key: "contract_type_id",
      label: "Contract Type",
      type: "select",
      options: (referenceData?.["ContractType"] ?? []).map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    { key: "is_active", label: "Is Active", type: "boolean", defaultValue: 1 }
  ];

  return (
    <BaseDataTable
      title="Contracts"
      caption="A list of all sports in the system"
      items={contracts}
      isLoading={isLoading}
      idField={ContractResources.idField}
      idPlaceholder="hide"
      endpoint={ContractResources.endpoint}
      onRefresh={refetch}
      invalidateKey={athlete_id 
        ? ContractResources.byAthlete(athlete_id).key 
        : ContractResources.byTeam(team_id).key
      }
      addLabel="Contract"
      fields={contractFields}
    />
  );
}