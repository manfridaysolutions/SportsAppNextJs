"use client";

import { queryContractsByAthlete, queryContractsByTeam } from "@/hooks/queryContracts";
import { resources } from "@/lib/resources";
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { Athlete } from "@/types/athlete";
import { Team } from "@/types/team";

export const REF_REQUIREMENTS_CONTRACTS = ["ContractType"];

export function ContractsTable({ athlete, team, referenceData }: {
  athlete?: Athlete | null;
  team?: Team | null;
  referenceData: Record<string, any[]>;
}) {
  const athlete_id = athlete?.athlete_id ?? null;
  const team_id = team?.team_id ?? null;

  // Use the athlete hook if we have an ID, otherwise fall back to the team hook
  // We call both, but only "enable" the one we actually need
  const athleteQuery = queryContractsByAthlete(athlete_id, { enabled: !!athlete_id });
  const teamQuery = queryContractsByTeam(team_id, { enabled: !athlete_id && !!team_id });

  // Simply pick the result set we want to use
  const { data: contracts = [], isLoading, refetch } = athlete_id ? athleteQuery : teamQuery;

  const contractFields: FieldDef[] = [
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
    { key: "is_active", label: "Is Active", type: "boolean", defaultValue: 1 },
    { key: "athlete_id", label: "Athlete", type: "number", visible: !!team_id, defaultValue: athlete_id },
    { key: "team_id", label: "Team", type: "number", visible: !!athlete_id, defaultValue: team_id }
  ];

  return (
    <BaseDataTable
      title="Contracts"
      caption="A list of all sports in the system"
      items={contracts}
      isLoading={isLoading}
      idField={resources.contracts.idField}
      idPlaceholder="hide"
      endpoint={resources.contracts.endpoint}
      onRefresh={refetch}
      invalidateKey={athlete_id 
        ? resources.contracts.byAthlete(athlete_id).key 
        : resources.contracts.byTeam(team_id).key
      }
      addLabel="Contract"
      fields={contractFields}
    />
  );
}