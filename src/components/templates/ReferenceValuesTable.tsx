"use client";

import { useReferenceValues } from "@/hooks/useReferenceValues"
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../organisms/EditableRow";

export function ReferenceValuesTable({ selectedReferenceCategoryId }: {
    selectedReferenceCategoryId: number | null; // NEW: add selectedSportId to props
}) {
    const { data: referenceValues = [], refetch, isLoading } = useReferenceValues(selectedReferenceCategoryId);

    const referenceValueFields: FieldDef[] = [
        { key: "value", label: "Value", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "sort_order", label: "Sort Order", type: "number", defaultValue: 1 }
    ]

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
            fields={referenceValueFields}
            addLabel="Value"
            selectedId={selectedReferenceCategoryId}
        />
   );
}