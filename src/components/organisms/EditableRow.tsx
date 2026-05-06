"use client";

import { useState } from "react";
import { TableRow, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { apiSave, apiDelete } from "@/lib/api";
import { EditableRowActions } from "../molecules/EditableRowActions";
import { ReadonlyRowActions } from "../molecules/ReadonlyRowActions";
import { DatePicker } from "../molecules/DatePicker";
import { EditableCell } from "./EditableCell";
import { FieldDef } from "../molecules/FieldDef"

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  fields: FieldDef[]; // Consolidated fields prop
  onRefresh: () => void;
  onClick?: () => void;
  className?: string;
  idPlaceholder?: string;
}

export function EditableRow<T extends Record<string, any>>({
  record,
  idField,
  endpoint,
  fields,
  onRefresh,
  onClick,
  className,
  idPlaceholder = "auto",
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const id = record[idField] as number;
  const merged = { ...record, ...buffer };

  const updateField = (field: string, value: any) => {
    setBuffer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (Object.keys(buffer).length === 0) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      // Filter out objects (like relations) to send only flat data to the API[cite: 3]
      const payload = Object.keys(buffer).reduce((acc, key) => {
        const value = buffer[key as keyof T];
        if (key !== idField && typeof value !== "object") {
          acc[key as keyof T] = value;
        }
        return acc;
      }, {} as Partial<T>);

      await apiSave(`${endpoint}${id}`, "PUT", payload);
      setBuffer({});
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBuffer({});
    setIsEditing(false);
  };

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
      className={`${className} ${isEditing ? "bg-muted/30" : "hover:bg-muted/50 transition-colors"}`}
    >
      {/* ID Cell[cite: 1] */}
      {idPlaceholder !== "hide" && (
        <TableCell className="font-mono text-xs text-muted-foreground">
          {id}
        </TableCell>
      )}

      {/* Dynamic Field Rendering */}
      {fields
        .filter((f) => f.visible !== false)
        .map((field) => (
          <TableCell key={field.key}>
            <EditableCell
              isEditing={isEditing && field.editable !== false}
              value={merged[field.key]}
              renderDisplay={() => {
                // Generic logic for boolean display
                if (field.type === "boolean") {
                  return Number(merged[field.key]) === 1 ? "Yes" : "No";
                }
                if (field.type === "select") {
                  const opt = field.options?.find((o) => String(o.id) === String(merged[field.key]));
                  return opt ? opt.label : (merged[field.key] ?? "N/A");
                }
                return merged[field.key];
              }}
              renderInput={() => {
                if (field.type === "boolean") {
                  // 1. Determine the current value string ("1" or "0")
                  const currentValue = merged[field.key] !== undefined
                    ? String(Number(merged[field.key]))
                    : "0";

                  return (
                    <Select
                      value={currentValue} // 2. This must match the <SelectItem> value exactly
                      onValueChange={(val) => updateField(field.key, Number(val))}
                    >
                      <SelectTrigger className="h-8">
                        {/* 3. SelectValue will automatically show the Label of the matched Item */}
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }
                if (field.type === "date") {
                  return (
                    <DatePicker
                      value={merged[field.key]}
                      onChange={(dateString) => updateField(field.key, dateString)}
                    />
                  );
                }
                if (field.type === "select") {
                  return (
                    <Select
                      value={String(merged[field.key] ?? "")}
                      onValueChange={(val) => updateField(field.key, Number(val))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.id} value={String(opt.id)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }
                return (
                  <Input
                    type={field.type}
                    className="h-8"
                    defaultValue={merged[field.key]}
                    onChange={(e) =>
                      updateField(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                  />
                );
              }}
            />
          </TableCell>
        ))}

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
            onDelete={handleDelete}
          />
        )}
      </TableCell>
    </TableRow>
  );
}