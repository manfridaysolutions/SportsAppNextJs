"use client";

import { useAthletesBySport } from "@/hooks/useAthletes";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

export const REF_REQUIREMENTS_ATHLETES = ["Country"];

export function AthletesTable({ sport_id, referenceData, selectedAthleteId, onSelectAthlete }: {
  sport_id: number | null;
  referenceData: Record<string, any[]>;
  selectedAthleteId?: number | null;
  onSelectAthlete?: (id: number) => void;
}) {
  const { data: athletes = [], refetch, isLoading } = useAthletesBySport(sport_id);

  const countries = referenceData?.["Country"] ?? [];

  const athleteFields: FieldDef[] = [
    { key: "display_name", label: "Display Name", type: "text" },
    { key: "first_name", label: "First Name", type: "text" },
    { key: "last_name", label: "Last Name", type: "text" },
    { key: "weight_lbs", label: "Weight (lbs)", type: "number" },
    { key: "height_inches", label: "Height (in.)", type: "number" },
    { key: "birth_date", label: "Birth Date", type: "text" },
    {
      key: "is_active",
      label: "Is Active",
      type: "boolean",
      defaultValue: 1,
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
    { key: "source_reference_id", label: "Source Reference", type: "number", visible: false }
  ];

return (
    <BaseDataTable
      title="Athletes"
      caption="A list of all sports in the system"
      items={athletes}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="athlete_id"
      idPlaceholder="hide"
      endpoint="/api/v1/athlete/"
      onRefresh={refetch}
      addLabel="Athlete"
      fields={athleteFields}
      // selectedId={selectedTeamId}
      // onSelect={onSelectTeam}
   />
  );
}