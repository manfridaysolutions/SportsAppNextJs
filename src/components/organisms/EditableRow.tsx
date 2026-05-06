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
import { Badge } from "@/components/ui/badge";
import { apiSave, apiDelete } from "@/lib/api";
import { EditableRowActions } from "../molecules/EditableRowActions";
import { ReadonlyRowActions } from "../molecules/ReadonlyRowActions";
import { DatePicker } from "../molecules/DatePicker";
import { EditableCell } from "./EditableCell";
import { FieldDef } from "../molecules/FieldDef"
import { ComboBoxEditor } from "../molecules/ComboBoxEditor";

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  fields: FieldDef[];
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
      // FIX: Ensure multi-select arrays (objects) are NOT filtered out.
      // We only want to exclude the ID field itself.
      const payload = Object.keys(buffer).reduce((acc, key) => {
        if (key !== idField) {
          acc[key as keyof T] = buffer[key as keyof T];
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
      {idPlaceholder !== "hide" && (
        <TableCell className="font-mono text-xs text-muted-foreground">
          {id}
        </TableCell>
      )}

      {fields
        .filter((f) => f.visible !== false)
        .map((field) => (
          <TableCell key={field.key}>
            <EditableCell
              isEditing={isEditing && field.editable !== false}
              value={merged[field.key]}
              renderDisplay={(value) => {
                // FIX: Explicitly handle multi-select rendering to avoid "Object as child" error
                if (field.type === "multi-select" && Array.isArray(value)) {
                  return (
                    <div className="flex flex-wrap gap-1">
                      {value.map((rel: any) => {
                        const opt = field.options?.find((o) => String(o.id) === String(rel.sport_id));
                        return (
                          <Badge key={rel.athlete_sport_id || rel.sport_id} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                            {opt ? opt.label : `ID: ${rel.sport_id}`}
                          </Badge>
                        );
                      })}
                    </div>
                  );
                }

                if (field.type === "boolean") {
                  return Number(value) === 1 ? "Yes" : "No";
                }

                if (field.type === "select") {
                  const opt = field.options?.find((o) => String(o.id) === String(value));
                  return opt ? opt.label : (value ?? "N/A");
                }

                return value !== null && value !== undefined ? String(value) : "";
              }}
              renderInput={() => {
                if (field.type === "boolean") {
                  const currentValue = merged[field.key] !== undefined
                    ? String(Number(merged[field.key]))
                    : "0";

                  return (
                    <Select
                      value={currentValue}
                      onValueChange={(val) => updateField(field.key, Number(val))}
                    >
                      <SelectTrigger className="h-8">
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

                if (field.type === "select" || field.type === "multi-select") {
                  const isMulti = field.type === "multi-select";
                  return (
                    <ComboBoxEditor
                      isMulti={isMulti}
                      options={field.options || []}
                      value={
                        isMulti
                          ? (merged[field.key] as any[])?.map(s => s.sport_id) || []
                          : merged[field.key]
                      }
                      onChange={(val: (string | number)[]) => {
                        const updatedRelationship = val.map(sportId => {
                          // 1. Look in the ORIGINAL record to see if this relationship already exists
                          const existing = (record[field.key] as any[])?.find(
                            (s) => String(s.sport_id) === String(sportId)
                          );

                          return {
                            // 2. If it exists, include the athlete_sport_id so the Repo recognizes it
                            ...(existing?.athlete_sport_id && { athlete_sport_id: existing.athlete_sport_id }),
                            sport_id: sportId,
                            athlete_id: id // This is the 'athlete_id' from the current row
                          };
                        });
                        updateField(field.key, updatedRelationship);
                      }}
                    />
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