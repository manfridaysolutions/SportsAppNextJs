"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query"; // Import queryClient
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
import { apiDelete } from "@/lib/api";
import { EditableRowActions } from "../molecules/EditableRowActions";
import { ReadonlyRowActions } from "../molecules/ReadonlyRowActions";
import { DatePicker } from "../molecules/DatePicker";
import { HyperlinkCell } from "../molecules/HyperlinkCell";
import { EditableCell } from "./EditableCell";
import { FieldDef } from "../molecules/FieldDef";
import { ComboBoxEditor } from "../molecules/ComboBoxEditor";
import { useGenericMutation } from "@/hooks/useGenericMutation";

interface EditableRowProps<T> {
  record: T;
  idField: keyof T;
  endpoint: string;
  fields: FieldDef[];
  onRefresh: () => void;
  invalidateKey?: readonly any[] | readonly (readonly any[])[];
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
  invalidateKey,
  onClick,
  className,
  idPlaceholder = "auto",
}: EditableRowProps<T>) {
  const [buffer, setBuffer] = useState<Partial<T>>({});
  const [isEditing, setIsEditing] = useState(false);

  const id = record[idField] as number;
  const merged = { ...record, ...buffer };

  const updateField = (field: string, value: any) => {
    setBuffer((prev) => ({ ...prev, [field]: value }));
  };

  // 1. Pass the invalidateKey directly to the hook. 
  // The hook's internal onSuccess will now handle the multi-key invalidation.
  const { mutate: performMutation, isPending: saving } = useGenericMutation<T>(
    invalidateKey, 
    {
      onSuccess: () => {
        // We only handle local UI state here
        setBuffer({});
        setIsEditing(false);
        onRefresh(); 
      },
      onError: (error) => {
        console.error("Mutation failed", error);
      }
    }
  );

  const handleSave = () => {
    // If id is 0 or undefined, it's an INSERT (POST), otherwise UPDATE (PUT)
    const isNew = !id || id === 0;

    if (!isNew && Object.keys(buffer).length === 0) {
      setIsEditing(false);
      return;
    }

    const payload = Object.keys(buffer).reduce((acc, key) => {
      if (key !== idField) {
        acc[key as keyof T] = buffer[key as keyof T];
      }
      return acc;
    }, {} as Partial<T>);

    performMutation({
      path: isNew ? endpoint : `${endpoint}${id}`,
      method: isNew ? "POST" : "PUT",
      data: payload,
    });
  };

  const handleCancel = () => {
    setBuffer({});
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this record?");
    if (!confirmed) return;

    // Use the mutation for DELETE to trigger invalidation automatically
    performMutation({
      path: `${endpoint}${id}`,
      method: "DELETE",
    });
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
                // Use custom render if provided in FieldDef
                if (field.render) {
                  return field.render(value, merged);
                }

                if (field.type === "link") {
                  return <HyperlinkCell item={merged} field={field} />;
                }

                if (field.type === "boolean") {
                  return Number(value) === 1 ? "Yes" : "No";
                }

                if (field.type === "select") {
                  const opt = field.options?.find((o) => String(o.id) === String(value));
                  return opt ? opt.label : (value ?? "N/A");
                }

                if (field.type === "multi-select" && Array.isArray(value)) {
                  return (
                    <div className="flex flex-wrap gap-1">
                      {value.map((item: any, idx) => {
                        const valId = item.id || item;
                        const opt = field.options?.find((o) => String(o.id) === String(valId));
                        return (
                          <Badge key={valId || idx} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                            {opt ? opt.label : `ID: ${valId}`}
                          </Badge>
                        );
                      })}
                    </div>
                  );
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
                  return (
                    <ComboBoxEditor
                      isMulti={field.type === "multi-select"}
                      options={field.options || []}
                      value={
                        field.type === "multi-select"
                          ? (merged[field.key] as any[])?.map(item => item.id || item.position_id || item) || []
                          : merged[field.key]
                      }
                      onChange={(val) => updateField(field.key, val)}
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