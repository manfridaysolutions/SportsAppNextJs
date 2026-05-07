"use client";

import { useReferenceValues } from "@/hooks/useQuery"
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

import { ReferenceCategory } from "@/types/referencecategory";

export function ReferenceValuesTable({ reference_Category }: {
    reference_Category: ReferenceCategory | null; // NEW: add selectedSportId to props
}) {
    const reference_category_id = reference_Category?.reference_category_id ?? null;

    const { data: referenceValues = [], refetch, isLoading } = useReferenceValues(reference_category_id);

    const referenceValueFields: FieldDef[] = [
        { key: "value", label: "Value", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "sort_order", label: "Sort Order", type: "number", defaultValue: 1 },
        { key: "reference_category_id", label: "Reference Category", type: "number", visible: false, defaultValue: reference_category_id },
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
            addLabel="Value"
            fields={referenceValueFields}
        />
   );
}