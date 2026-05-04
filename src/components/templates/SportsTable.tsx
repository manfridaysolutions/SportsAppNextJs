"use client";

import { useSports } from "@/hooks/useSports";
import { BaseDataTable2 } from "../organisms/BaseDataTable2";
import { FieldDef } from "../organisms/EditableRow2";

export function SportsTable({ referenceData, selectedId, onSelectSport }: {
  referenceData: Record<string, any[]>;
  selectedId: number | null;
  onSelectSport: (id: number) => void;
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
      type: "select",
      options: [
        { id: 1, label: "Yes" },
        { id: 0, label: "No" },
      ],
      defaultValue: 1,
    },
    { key: "governing_body", label: "Governing Body", type: "text" },
    { key: "description", label: "Description", type: "text" }
  ];

return (
    <BaseDataTable2
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
      selectedId={selectedId}
      onSelect={onSelectSport}
      headers={["Name", "Category", "Team Sport", "Governing Body", "Description"]}
   />
  );
}