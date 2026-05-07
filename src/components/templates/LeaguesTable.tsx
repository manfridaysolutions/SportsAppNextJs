"use client";

import { resources } from "@/lib/resources";
import { useLeaguesBySport } from "@/hooks/useQuery";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";
import { Sport } from "@/types/sport";
import { League } from "@/types/league";

export const REF_REQUIREMENTS_LEAGUES = ["Country"];

export function LeaguesTable({ sport, referenceData, selectedLeague, onSelectLeague }: {
    sport: Sport | null;
    referenceData: Record<string, any[]>;
    selectedLeague?: League | null;
    onSelectLeague?: (league: League) => void;
}) {
    const sport_id = sport?.sport_id ?? null;

    const { data: leagues = [], refetch, isLoading } = useLeaguesBySport(sport_id);
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
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: sport_id },
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
            invalidateKey={resources.leagues.bySport(sport_id).key}
            addLabel="League"
            fields={leagueFields}
            selectedId={selectedLeague?.league_id}
            onSelect={onSelectLeague}
        />
    );
}