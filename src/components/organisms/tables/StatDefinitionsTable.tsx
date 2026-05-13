"use client";

import { resources } from "@/lib/resources";
import { queryStatDefinitions } from "@/hooks/queryStatDefinitions"
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef"
import { Sport } from "@/types/sport";

export const REF_REQUIREMENTS_STAT_DEF = ["Statistical Unit"];

export function StatDefinitionsTable({ sport, referenceData }: {
    sport: Sport | null;
    referenceData: Record<string, any[]>;
}) {
    const sport_id = sport?.sport_id ?? null;

    const { data: statDefinitions = [], refetch, isLoading } = queryStatDefinitions(sport_id);
    const stat_units = referenceData?.["Statistical Unit"] ?? [];
    
    const statDefinitionFields: FieldDef[] = [
        { key: "stat_name", label: "Name", type: "text" },
        { key: "stat_abbreviation", label: "Abbr", type: "text" },
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: sport_id },
        {
            key: "stat_unit_id",
            label: "Stat Unit",
            type: "select",
            options: stat_units.map((c) => ({ id: c.reference_value_id, label: c.value })),
        }
     ];   

    return (
        <BaseDataTable
            title="Statistics"
            caption="A list of all statDefinitions in the system"
            items={statDefinitions}
            isLoading={isLoading}
            idField={resources.statDefinitions.idField}
            idPlaceholder="hide"
            endpoint={resources.statDefinitions.endpoint}
            onRefresh={refetch}
            invalidateKey={resources.statDefinitions.bySport(sport_id).key}
            addLabel="Stat"
            fields={statDefinitionFields}
       />
    );
}