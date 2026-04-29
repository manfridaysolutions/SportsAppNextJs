"use client";

import { useState } from "react";
import { TableRow, TableCell } from "../ui/table";
import { apiSave, apiDelete } from "@/lib/api";
import { EditableRowActions } from "../molecules/EditableRowActions";
import { ReadonlyRowActions } from "../molecules/ReadonlyRowActions";

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  onRefresh: () => void;
  onClick?: () => void;
  className?: string;
  children: (
    data: T,
    update: (field: keyof T, value: any) => void,
    isEditing: boolean
  ) => React.ReactNode;
}

export function EditableRow<T extends object>({
  record,
  idField,
  endpoint,
  onRefresh,
  onClick,
  className,
  children
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const id = record[idField] as number;

  const merged = { ...record, ...buffer };

  const updateField = (field: keyof T, value: any) => {
    setBuffer((prev) => ({
      ...prev,
      [field]: value
    } as T));
  };

  const handleSave = async () => {
    if (Object.keys(buffer).length === 0) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const fullData = { ...record, ...buffer };

      const payload = Object.keys(fullData).reduce((acc, key) => {
        const value = fullData[key as keyof T];
        if (key !== idField && typeof value !== "object" && value !== null) {
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
    setBuffer({});
    setIsEditing(false);
  };

  // ⭐ NEW: Delete handler
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this record?");
    if (!confirmed) return;

    try {
      await apiDelete(`${endpoint}${id}`);
      onRefresh();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <TableRow
      onClick={onClick}
      className={isEditing ? "bg-muted/30" : "hover:bg-muted/50 transition-colors"}
    >
      {children(merged, updateField, isEditing)}

      <TableCell className="text-right">
        {isEditing ? (
          <EditableRowActions
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={saving}
          />
        ) : (
          <ReadonlyRowActions
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}   // ⭐ wired in
          />
        )}
      </TableCell>
    </TableRow>
  );
}
