"use client";

import { useReferenceCategories } from "@/hooks/useQuery";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { FieldDef } from "../molecules/FieldDef";

import { ReferenceCategory } from "@/types/referencecategory";

export function ReferenceCategoriesTable({ selectedReferenceCategory, onSelectCategory }: {
  selectedReferenceCategory: ReferenceCategory | null;
  onSelectCategory: (referenceCategory: ReferenceCategory) => void;
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
      selectedId={selectedReferenceCategory?.reference_category_id}
      onSelect={onSelectCategory}
    />
  );
}