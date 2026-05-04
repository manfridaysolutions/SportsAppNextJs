"use client";

import { useStatDefinitions } from "@/hooks/useStatDefinitions";
import { BaseDataTable2 } from "../organisms/BaseDataTable2";
import { FieldDef } from "../organisms/EditableRow2";

export function StatDefinitionsTable({ referenceData, selectedSportId }: {
    referenceData: Record<string, any[]>;
    selectedSportId: number | null;
}) {
    const { data: statDefinitions = [], refetch, isLoading } = useStatDefinitions(selectedSportId);
    const stat_units = referenceData?.["Statistical Unit"] ?? [];
    
    const statDefinitionFields: FieldDef[] = [
        { key: "stat_name", label: "Name", type: "text" },
        { key: "stat_abbreviation", label: "Abbreviation", type: "text" },
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
        {
            key: "stat_unit_id",
            label: "Stat Unit",
            type: "select",
            options: stat_units.map((c) => ({ id: c.reference_value_id, label: c.value })),
        }
     ];   

    return (
        <BaseDataTable2
            title="Stat Definitions"
            caption="A list of all statDefinitions in the system"
            items={statDefinitions}
            isLoading={isLoading}
            idField="stat_def_id"
            idPlaceholder="hide"
            endpoint="/api/v1/statDefinition/"
            onRefresh={refetch}
            addLabel="Stat"
            headers={["Name", "Abbreviation", "Stat Unit"]}
            fields={statDefinitionFields}
       />
    );
}