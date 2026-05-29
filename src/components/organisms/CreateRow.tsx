"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { EditableRowActions } from "../molecules/EditableRowActions";
import { FieldDef } from "../molecules/FieldDef";
import { ComboBoxEditor } from "../molecules/ComboBoxEditor";
import { DatePicker } from "../molecules/DatePicker";
import { useGenericMutation } from "@/hooks/useGenericMutation";

interface CreateRowProps {
  fields: FieldDef[];
  endpoint: string;
  onCreateSuccess: () => void;
  invalidateKey?: readonly any[];
  onCancel: () => void;
  idPlaceholder?: string | number;
}

export function CreateRow({
  fields,
  endpoint,
  onCreateSuccess,
  invalidateKey,
  onCancel,
  idPlaceholder = "auto",
}: CreateRowProps) {
  // 1. Initialize form state with defaults
  const initialState = Object.fromEntries(
    fields.map((f) => {
      if (f.type === "multi-select") return [f.key, []];
      let fallback: any = "";
      if (f.type === "number") fallback = f.defaultValue ?? 0;
      if (f.type === "boolean") fallback = f.defaultValue ?? 0;
      return [f.key, f.defaultValue ?? fallback];
    })
  );

  const [form, setForm] = useState(initialState);

  // 2. Setup the Generic Mutation
  const { mutate: createRecord, isPending: saving } = useGenericMutation(
    invalidateKey,
    {
      onSuccess: () => {
        onCreateSuccess();
      },
      onError: (err) => {
        console.error("Create failed:", err);
      }
    }
  );

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 1. Create a shallow copy to avoid mutating the live form state
    const payload = { ...form };

    fields.forEach((field) => {
      const value = payload[field.key];

      // Handle Empty Values for non-text fields
      if (value === "" || value === undefined || value === null) {
        if (field.type === "number" || field.type === "date" || field.type === "select") {
          // Remove from payload so FastAPI doesn't try to parse "" as an int/date
          delete payload[field.key];
        }
      }
      // Ensure numeric types are actually Numbers
      else if (field.type === "number" || field.type === "select") {
        payload[field.key] = Number(value);
      }
      // Ensure Booleans are 0/1 or true/false depending on your DB preference
      else if (field.type === "boolean") {
        payload[field.key] = Number(value);
      }
    });

    // 2. Trigger the generic mutation
    createRecord({
      path: endpoint,
      method: "POST",
      data: payload,
    });
  };

  return (
    <TableRow className="bg-muted/40">
      {idPlaceholder !== "hide" && (
        <TableCell className="text-muted-foreground italic text-xs">
          {idPlaceholder}
        </TableCell>
      )}

      {fields
        .filter((f) => f.visible !== false)
        .map((field) => (
          <TableCell key={field.key} className="py-2">
            {field.editable === false && (
              <span className="text-muted-foreground italic text-xs">auto</span>
            )}

            {field.editable !== false && field.type === "text" && (
              <Input
                className="h-8 text-xs"
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
              />
            )}

            {field.editable !== false && field.type === "link" && (
                <Input
                    type="url"
                    className="h-8 text-xs"
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                />
            )}

            {field.editable !== false && field.type === "number" && (
              <Input
                className="h-8 text-xs"
                type="number"
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value === "" ? "" : Number(e.target.value))}
              />
            )}

            {field.editable !== false && field.type === "date" && (
              <DatePicker
                value={form[field.key]}
                onChange={(date) => update(field.key, date)}
              />
            )}

            {field.editable !== false && field.type === "boolean" && (
              <Select
                value={String(form[field.key] ?? "0")}
                onValueChange={(v) => update(field.key, Number(v))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            )}

            {field.editable !== false && (field.type === "select" || field.type === "multi-select") && (
              <ComboBoxEditor
                isMulti={field.type === "multi-select"}
                options={field.options || []}
                value={form[field.key] || (field.type === "multi-select" ? [] : "")}
                onChange={(val) => update(field.key, val)}
              />
            )}
          </TableCell>
        ))}
      <TableCell className="text-right py-2">
        <EditableRowActions
          onSave={handleSave}
          onCancel={onCancel}
          isSaving={saving}
        />
      </TableCell>
    </TableRow>
  );
}