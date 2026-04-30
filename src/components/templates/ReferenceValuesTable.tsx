"use client";

import { BaseDataTable } from "../organisms/BaseDataTable";
import { useReferenceValues } from "@/hooks/useReferenceValues"

import {
    TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import { EditableCell } from "../organisms/EditableCell";

export function ReferenceValuesTable({ selectedReferenceCategoryId }: {
    selectedReferenceCategoryId: number | null; // NEW: add selectedSportId to props
}) {
    const { data: referenceValues = [], refetch, isLoading } = useReferenceValues(selectedReferenceCategoryId);

    return (
        <BaseDataTable
            title="Values"
            caption="A list of all reference values in the system"
            items={referenceValues}
            isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
            idField="reference_value_id"
            idPlaceholder="hide"
            endpoint="/api/v1/reference-values/"
            onRefresh={refetch}
            addLabel="Value"
            selectedId={selectedReferenceCategoryId}
            headers={["Value", "Description", "Sort Order"]}
            createFields={[
                { key: "value", label: "Value", type: "text" },
                { key: "description", label: "Description", type: "text" },
                { key: "sort_order", label: "Sort Order", type: "number", defaultValue: 1 },
            ]}
        >
            {(data, update, isEditing) => (
                <>
                    {/* League Name Cell */}
                    <TableCell>
                        <EditableCell
                            isEditing={isEditing}
                            value={data.value}
                            renderInput={() => (
                                <Input
                                    defaultValue={data.value}
                                    onChange={(e) => update("value", e.target.value)}
                                    autoFocus
                                    className="h-8"
                                />
                            )}
                        />
                    </TableCell>
                    <TableCell className="w-[100px]">
                        <EditableCell
                            isEditing={isEditing}
                            value={data.description}
                            renderInput={() => (
                                <Input
                                    type="text"
                                    defaultValue={data.description ?? ""}
                                    onChange={(e) => update("description", e.target.value)}
                                    className="h-8"
                                />
                            )}
                        />
                    </TableCell>
                    <TableCell className="w-[100px]">
                        <EditableCell
                            isEditing={isEditing}
                            value={data.sort_order}
                            renderInput={() => (
                                <Input
                                    defaultValue={data.sort_order ?? ""}
                                    onChange={(e) => update("sort_order", e.target.value)}
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