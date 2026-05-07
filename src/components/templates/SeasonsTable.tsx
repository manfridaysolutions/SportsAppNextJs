"use client";

import { useSeasons } from "@/hooks/useSeasons";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

import { League } from "@/types/league"

export function SeasonsTable({ league }: {
  league: League | null;
}) {
  const league_id = league?.league_id ?? null;

  const { data: seasons = [], refetch, isLoading } = useSeasons(league_id);

  const seasonFields: FieldDef[] = [
    { key: "season_year", label: "Season", type: "text" },
    { key: "start_date", label: "Start Date", type: "text" },
    { key: "end_date", label: "End Date", type: "text" },
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
      title="Seasons"
      caption="A list of all sports in the system"
      items={seasons}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="season_id"
      idPlaceholder="hide"
      endpoint="/api/v1/season/"
      onRefresh={refetch}
      addLabel="Season"
      fields={seasonFields}
   />
  );
}