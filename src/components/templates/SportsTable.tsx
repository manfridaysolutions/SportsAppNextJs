"use client";

import { useSports } from "@/hooks/useSports";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

import { Sport } from "@/types/sport";

export const REF_REQUIREMENTS_SPORTS = ["SportCategory"];

export function SportsTable({ referenceData, selectedSport, onSelectSport }: {
  referenceData: Record<string, any[]>;
  selectedSport?: Sport | null;
  onSelectSport?: (sport: Sport) => void;
}) {
  const { data: sports = [], refetch, isLoading } = useSports();
  const sport_categories = referenceData?.["SportCategory"] ?? [];

  const sportFields: FieldDef[] = [
    { key: "sport_name", label: "Name", type: "text" },
    {
      key: "category_id",
      label: "Category",
      type: "select",
      options: sport_categories.map((c) => ({
        id: c.reference_value_id,
        label: c.value,
      })),
    },
    {
      key: "is_team_sport",
      label: "Team Sport",
      type: "boolean",
      defaultValue: 1,
    },
    { key: "governing_body", label: "Governing Body", type: "text" },
    { key: "description", label: "Description", type: "text" }
  ];

return (
    <BaseDataTable
      title="Sports"
      caption="A list of all sports in the system"
      items={sports}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="sport_id"
      idPlaceholder="hide"
      endpoint="/api/v1/sports/"
      onRefresh={refetch}
      addLabel="Sport"
      fields={sportFields}
      selectedId={selectedSport?.sport_id}
      showRowsPerPage={true}
      onSelect={onSelectSport}
   />
  );
}