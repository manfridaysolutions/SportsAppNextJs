"use client";

import { useReferenceCategories } from "@/hooks/useReferenceCategories";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../organisms/EditableRow";

export function ReferenceCategoriesTable({ selectedId, onSelectCategory }: {
  selectedId: number | null;
  onSelectCategory: (id: number) => void;
}) {
  const { data: referenceCategories = [], refetch, isLoading } = useReferenceCategories();

  const referenceCategoryFields: FieldDef[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
  ]

  return (
    <BaseDataTable
      title="Categories"
      caption="A list of all reference categories in the system"
      items={referenceCategories}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="reference_category_id"
      idPlaceholder="hide"
      fields={referenceCategoryFields}
      endpoint="/api/v1/reference-categories/"
      onRefresh={refetch}
      addLabel="Category"
      selectedId={selectedId}
      onSelect={onSelectCategory}
    />
  );
}