"use client";

import { useState } from "react";
import { TableRow } from "@/components/ui/table";
import { apiSave } from "@/lib/api";

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  onRefresh: () => void;
  children: (
    data: T,
    update: (field: keyof T, value: any) => void,
    isEditing: boolean // Add this to the render prop
  ) => React.ReactNode;
}

export function EditableRow<T extends object>({
  record, idField, endpoint, onRefresh, children
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const [isEditing, setIsEditing] = useState(false); // Track if this row is active
  const id = record[idField] as number;

  const handleBlur = async (e: React.FocusEvent) => {
    // Detect if we left the entire row
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsEditing(false); // Disable edit mode when clicking outside

      if (Object.keys(buffer).length > 0) {
        try {
          const fullData = { ...record, ...buffer };
          const payload = Object.keys(fullData).reduce((acc, key) => {
            const value = fullData[key as keyof T];
            if (key !== idField && typeof value !== 'object' && value !== null) {
              acc[key as keyof T] = value;
            }
            return acc;
          }, {} as Partial<T>);

          await apiSave(`${endpoint}${id}`, "PUT", payload);
          setBuffer({});
          onRefresh();
        } catch (error) {
          console.error("Auto-save failed", error);
        }
      }
    }
  };

  const updateField = (field: keyof T, value: any) => {
    setBuffer(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TableRow
      onBlur={handleBlur}
      onClick={() => setIsEditing(true)} // Enable on click
      className={isEditing ? "" : "cursor-pointer hover:bg-muted/50"}
    >
      {children(record, updateField, isEditing)}
    </TableRow>
  );
}