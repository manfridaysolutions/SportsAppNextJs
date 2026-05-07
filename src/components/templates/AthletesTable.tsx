"use client";

import { useAthletesBySport } from "@/hooks/useAthletes";
import { useSports } from "@/hooks/useSports";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";
import { Sport } from "@/types/sport"
import { Athlete } from "@/types/athlete";

export const REF_REQUIREMENTS_ATHLETES = ["Country"];

export function AthletesTable({ sport, referenceData, selectedAthlete, onSelectAthlete }: {
  sport: Sport | null;
  referenceData: Record<string, any[]>;
  selectedAthlete?: Athlete | null;
  onSelectAthlete?: (athlete: Athlete) => void;
}) {
  const sport_id = sport?.sport_id ?? null;

  const { data: athletes = [], refetch, isLoading } = useAthletesBySport(sport_id);

  const { data: sportsData = [] } = useSports();

  const countries = referenceData?.["Country"] ?? [];

  const athleteFields: FieldDef[] = [
    { key: "display_name", label: "Display Name", type: "text" },
    { key: "first_name", label: "First Name", type: "text" },
    { key: "last_name", label: "Last Name", type: "text" },
    { key: "weight_lbs", label: "Weight (lbs)", type: "number" },
    { key: "height_inches", label: "Height (in.)", type: "number" },
    { key: "birth_date", label: "Birth Date", type: "date" },
    {
      key: "is_active",
      label: "Is Active",
      type: "boolean",
      defaultValue: 1,
    },
    {
      key: "country_id",
      label: "Nationality",
      type: "select",
      options: countries.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    {
      key: "athlete_sports", // Key must match the SQLModel relationship
      label: "Sports",
      type: "multi-select",
      options: sportsData.map((s) => ({
        id: s.sport_id, 
        label: s.sport_name,
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
   />
  );
}