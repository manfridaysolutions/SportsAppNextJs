// components/EditableRow.tsx
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
    update: (field: keyof T, value: any) => void
  ) => React.ReactNode;
}

export function EditableRow<T extends object>({ 
  record, idField, endpoint, onRefresh, children 
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const id = record[idField] as number;

  const handleBlur = async (e: React.FocusEvent) => {
    // Detect if we left the entire row
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (Object.keys(buffer).length > 0) {
        try {
          // 1. Merge the record and the unsaved changes
          const fullData = { ...record, ...buffer };

          // 2. Generic Filter: Remove nested objects and the primary key
          const payload = Object.keys(fullData).reduce((acc, key) => {
            const value = fullData[key as keyof T];
          
            // Only include the field if:
            // - It's NOT the primary ID field
            // - It's NOT a nested object/array (relationships)
            if (
                key !== idField && 
                typeof value !== 'object' && 
                value !== null
            ) {
                acc[key as keyof T] = value;
            }
            return acc;
            }, {} as Partial<T>);

            // 3. Send only the flat fields (e.g., league_name, level, sport_id)
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
    <TableRow onBlur={handleBlur}>
      {children(record, updateField)}
    </TableRow>
  );
}