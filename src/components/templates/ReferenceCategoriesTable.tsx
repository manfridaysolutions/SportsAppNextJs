"use client";

import { BaseDataTable } from "../organisms/BaseDataTable";
import {
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import { EditableCell } from "../organisms/EditableCell";
import { useReferenceCategories } from "@/hooks/useReferenceCategories";

export function ReferenceCategoriesTable({ selectedId, onSelectCategory }: {
  selectedId: number | null;
  onSelectCategory: (id: number) => void;
}) {
  const { data: referenceCategories = [], refetch, isLoading } = useReferenceCategories();

  return (
    <BaseDataTable
      title="Categories"
      caption="A list of all reference categories in the system"
      items={referenceCategories}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      idField="reference_category_id"
      idPlaceholder="hide"
      endpoint="/api/v1/reference-categories/"
      onRefresh={refetch}
      addLabel="Category"
      selectedId={selectedId}
      onSelect={onSelectCategory}
      headers={["Name", "Description"]}
      createFields={[
        { key: "name", label: "Name", type: "text" },
        { key: "description", label: "Description", type: "text" },
      ]}
    >
      {(data, update, isEditing) => (
        <>
          {/* Name */}
          <TableCell>
            <EditableCell
              isEditing={isEditing}
              value={data.name}
              renderInput={() => (
                <Input
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
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
                  value={data.description ?? ""}
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