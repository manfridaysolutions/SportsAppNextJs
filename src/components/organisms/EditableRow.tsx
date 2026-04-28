"use client";

import { useState } from "react";
import { TableRow, TableCell } from "../ui/table";
import { apiSave } from "@/lib/api";
import { RowActions } from "../molecules/RowActions";

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  onRefresh: () => void;
  children: (
    data: T,
    update: (field: keyof T, value: any) => void,
    isEditing: boolean
  ) => React.ReactNode;
}

export function EditableRow<T extends object>({
  record, idField, endpoint, onRefresh, children
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const id = record[idField] as number;

  const updateField = (field: keyof T, value: any) => {
    setBuffer(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Only save if there are actual changes in the buffer
    if (Object.keys(buffer).length === 0) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const fullData = { ...record, ...buffer };
      
      // Clean the payload (excluding ID and complex objects)
      const payload = Object.keys(fullData).reduce((acc, key) => {
        const value = fullData[key as keyof T];
        if (key !== idField && typeof value !== 'object' && value !== null) {
          acc[key as keyof T] = value;
        }
        return acc;
      }, {} as Partial<T>);

      await apiSave(`${endpoint}${id}`, "PUT", payload);
      setBuffer({});
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Manual save failed", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBuffer({}); // Discard changes
    setIsEditing(false);
  };

  return (
    <TableRow
      className={isEditing ? "bg-muted/30" : "hover:bg-muted/50 transition-colors"}
    >
      {/* 1. Render the fields passed via children */}
      {children(record, updateField, isEditing)}

      {/* 2. Action Cell: Show Edit button or Save/Cancel Molecule */}
      <TableCell className="text-right">
        {isEditing ? (
          <RowActions 
            onSave={handleSave} 
            onCancel={handleCancel} 
            isSaving={saving} 
          />
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}