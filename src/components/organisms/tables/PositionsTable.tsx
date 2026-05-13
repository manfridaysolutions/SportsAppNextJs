"use client";

import { resources } from "@/lib/resources";
import { queryPositions } from "@/hooks/queryPositions"
import { BaseDataTable } from "../BaseDataTable";
import { FieldDef } from "../../molecules/FieldDef";
import { Sport } from "@/types/sport";

export function PositionsTable({ sport }: { 
    sport: Sport | null;
}) {
    const sport_id = sport?.sport_id ?? null;

    const { data: positions = [], refetch, isLoading } = queryPositions(sport_id);    

    const positionFields: FieldDef[] = [
        { key: "position_name", label: "Name", type: "text" },
        { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: sport_id },
        { key: "position_abbreviation", label: "Abbr", type: "text" },
        { key: "description", label: "Description", type: "text" },
    ];

    return (
        <BaseDataTable
            title="Positions"
            caption="A list of all positions in the system"
            items={positions}
            isLoading={isLoading}
            idField={resources.positions.idField}
            idPlaceholder="hide"
            endpoint={resources.positions.endpoint}
            onRefresh={refetch}
            invalidateKey={resources.positions.bySport(sport_id).key}
            addLabel="Position"
            fields={positionFields}
       />
    );
}