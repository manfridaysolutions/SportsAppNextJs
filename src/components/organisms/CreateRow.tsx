"use client";

import { EditableRowActions } from "../molecules/EditableRowActions";
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
import { FieldDef } from "../molecules/FieldDef"
import { ComboBoxEditor } from "../molecules/ComboBoxEditor";
import { DatePicker } from "../molecules/DatePicker"; // Import your DatePicker

interface CreateRowProps {
  fields: FieldDef[];
  endpoint: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
  idPlaceholder?: string | number;
}

export function CreateRow({
  fields,
  endpoint,
  onCreateSuccess,
  onCancel,
  idPlaceholder = "auto",
}: CreateRowProps) {
  // Initialize state
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
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      // Ensure no double slashes in URL construction
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

      const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create record");

      onCreateSuccess();
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setSaving(false);
    }
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
                value={
                  // 1. Just use the value directly from the form state
                  // (Assuming form state for multi-select is now [1, 2, 3])
                  field.type === "multi-select"
                    ? (form[field.key] || [])
                    : form[field.key]
                }
                onChange={(val: string | number | (string | number)[]) => {
                  // 2. No more mapping to objects! Just send the raw ID or array of IDs
                  update(field.key, val);
                }}
              />
            )}
          </TableCell>
        ))}
      <TableCell className="text-right py-2">
        <EditableRowActions
          onSave={save}
          onCancel={onCancel}
          isSaving={saving}
        />
      </TableCell>
    </TableRow>
  );
}