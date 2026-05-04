"use client";

import { usePositions } from "@/hooks/usePositions"
import { BaseDataTable2 } from "../organisms/BaseDataTable2";
import { FieldDef } from "../organisms/EditableRow2";

export function PositionsTable({ selectedSportId }: { 

    selectedSportId: number | null 
}) {
    const { data: positions = [], refetch, isLoading } = usePositions(selectedSportId);

    const positionFields: FieldDef[] = [
        { key: "position_name", label: "Name", type: "text" },
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
        { key: "position_abbreviation", label: "Abbreviaton", type: "text" },
        { key: "description", label: "Description", type: "text" },
    ];

    return (
        <BaseDataTable2
            title="Positions"
            caption="A list of all positions in the system"
            items={positions}
            isLoading={isLoading}
            idField="position_id"
            idPlaceholder="hide"
            endpoint="/api/v1/position/"
            onRefresh={refetch}
            addLabel="Position"
            headers={["Name", "Abbreviation", "Description"]}
            fields={positionFields}
       />
    );
}