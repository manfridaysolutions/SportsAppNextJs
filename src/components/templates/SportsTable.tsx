"use client";

import { resources } from "@/lib/resources";
import { useSports } from "@/hooks/useQuery";
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
    {
      key: "sport_name",
      label: "Sport",
      type: "link",
      linkOptions: {
        baseUrl: "/leagues",
        params: { sport_id: "sport_id" } // Pulls 'sport_id' from the current row data
      }
    },
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
    { key: "description", label: "Description", type: "text" },
    {
      key: "athlete_link", // Key is still needed for the column index
      label: "Athletes",
      type: "link",
      linkOptions: {
        baseUrl: "/athletes",
        params: { sport_id: "sport_id" },
        displayText: "View Athletes" // All rows will show this text
      }
    }
  ];

  return (
    <BaseDataTable
      title="Sports"
      caption="A list of all sports in the system"
      items={sports}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField={resources.sports.idField}
      idPlaceholder="hide"
      endpoint={resources.sports.endpoint}
      onRefresh={refetch}
      invalidateKey={resources.sports.key}
      addLabel="Sport"
      fields={sportFields}
      selectedId={selectedSport?.sport_id}
      showRowsPerPage={true}
      onSelect={onSelectSport}
    />
  );
}