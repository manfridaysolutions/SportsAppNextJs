"use client";

import { useLeagues } from "@/hooks/useLeagues";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../organisms/EditableRow";

export function LeaguesTable({ referenceData, selectedSportId }: {
    referenceData: Record<string, any[]>;
    selectedSportId: number | null;
}) {
    const { data: leagues = [], refetch, isLoading } = useLeagues(selectedSportId);
    const countries = referenceData?.["Country"] ?? [];

    const leagueFields: FieldDef[] = [
        { key: "league_name", label: "Name", type: "text" },
        { key: "level", label: "Level", type: "number", defaultValue: 1 },
        {
            key: "country_id",
            label: "Country",
            type: "select",
            options: countries.map((c) => ({ id: c.reference_value_id, label: c.value })),
        },
        // This remains hidden in UI but can be used for API defaults
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
    ];

    return (
        <BaseDataTable
            title="Leagues"
            caption="A list of all leagues in the system"
            items={leagues}
            isLoading={isLoading}
            idField="league_id"
            idPlaceholder="hide"
            endpoint="/api/v1/league/"
            onRefresh={refetch}
            addLabel="League"
            fields={leagueFields}
        />
    );
}