"use client";

import { usePositions } from "@/hooks/usePositions"
import { BaseDataTable } from "../organisms/BaseDataTable";
import { TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { EditableCell } from "../organisms/EditableCell";


export function PositionsTable({ selectedSportId }: { 
    selectedSportId: number | null 
}) {
    const { data: positions = [], refetch, isLoading } = usePositions(selectedSportId);

    return (
        <BaseDataTable
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
            createFields={[
                { key: "position_name", label: "Name", type: "text" },
                { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
                { key: "position_abbreviation", label: "Abbreviaton", type: "text" },
                { key: "description", label: "Description", type: "text" },
            ]}
        >
            {(data, update, isEditing) => (
                <>
                    <TableCell>
                        <EditableCell
                            isEditing={isEditing}
                            value={data.position_name}
                            renderInput={() => (
                                <Input
                                    defaultValue={data.position_name}
                                    onChange={(e) => update("position_name", e.target.value)}
                                    className="h-8"
                                />
                            )}
                        />
                    </TableCell>
                    <TableCell>
                        <EditableCell
                            isEditing={isEditing}
                            value={data.position_abbreviation}
                            renderInput={() => (
                                <Input
                                    defaultValue={data.position_abbreviation ?? ""}
                                    onChange={(e) => update("position_abbreviation", e.target.value)}
                                    className="h-8"
                                />
                            )}
                        />
                    </TableCell>
                    <TableCell>
                        <EditableCell
                            isEditing={isEditing}
                            value={data.description}
                            renderInput={() => (
                                <Input
                                    defaultValue={data.description ?? ""}
                                    onChange={(e) => update("description", e.target.value)}
                                    className="h-8"
                                />
                            )}
                        />
                    </TableCell>
                </>
            )}
        </BaseDataTable>
    );
}