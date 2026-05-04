"use client";

import { useStatDefinitions } from "@/hooks/useStatDefinitions";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { EditableCell } from "../organisms/EditableCell";

export function StatDefinitionsTable({ referenceData, selectedSportId }: {
    referenceData: Record<string, any[]>;
    selectedSportId: number | null;
}) {
    const { data: statDefinitions = [], refetch, isLoading } = useStatDefinitions(selectedSportId);
    
    const filteredRefData = referenceData && referenceData["Statistical Unit"]
        ? { Country: referenceData["Statistical Unit"] } 
        : undefined;

    const stat_units = referenceData?.["Statistical Unit"] ?? [];

    return (
        <BaseDataTable
            title="Stat Definitions"
            caption="A list of all statDefinitions in the system"
            items={statDefinitions}
            isLoading={isLoading}
            idField="stat_def_id"
            idPlaceholder="hide"
            endpoint="/api/v1/statDefinition/"
            onRefresh={refetch}
            referenceData={filteredRefData}
            addLabel="Stat"
            headers={["Name", "Abbreviation", "Stat Unit"]}
            createFields={[
                { key: "stat_name", label: "Name", type: "text" },
                { key: "stat_abbreviation", label: "Abbreviation", type: "text" },
                { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
                {
                    key: "stat_unit_id",
                    label: "Stat Unit",
                    type: "select",
                    options: stat_units.map((c) => ({ id: c.reference_value_id, label: c.value })),
                },
            ]}
        >
            {(data, update, isEditing, refData) => {
                const rowStatUnits = refData["Statistical Unit"] ?? [];
                return (
                    <>
                        <TableCell>
                            <EditableCell
                                isEditing={isEditing}
                                value={data.stat_name}
                                renderInput={() => (
                                    <Input
                                        defaultValue={data.stat_name}
                                        onChange={(e) => update("statDefinition_name", e.target.value)}
                                        className="h-8"
                                    />
                                )}
                            />
                        </TableCell>
                        <TableCell>
                            <EditableCell
                                isEditing={isEditing}
                                value={data.stat_abbreviation}
                                renderInput={() => (
                                    <Input
                                        defaultValue={data.stat_abbreviation ?? ""}
                                        onChange={(e) => update("stat_abbreviation", e.target.value)}
                                        className="h-8"
                                    />
                                )}
                            />
                        </TableCell>
                        <TableCell>
                            <EditableCell
                                isEditing={isEditing}
                                value={data.stat_unit_id}
                                renderInput={() => (
                                    <Select
                                        value={data.stat_unit_id ? String(data.stat_unit_id) : ""}
                                        onValueChange={(val) => update("stat_unit_id", val === "" ? null : Number(val))}
                                    >
                                        <SelectTrigger className="w-full h-8">
                                            <SelectValue placeholder="Select reference values">
                                                {rowStatUnits.find(c => String(c.reference_value_id) === String(data.stat_unit_id))?.value}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rowStatUnits.map((c) => (
                                                <SelectItem key={c.reference_value_id} value={String(c.reference_value_id)}>
                                                    {c.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                renderDisplay={() => <span>{data.stat_unit?.value ?? "N/A"}</span>}
                            />
                        </TableCell>
                    </>
                );
            }}
        </BaseDataTable>
    );
}