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

// Updated to include "boolean" type
interface FieldDef {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "boolean"; 
    options?: { id: number | string; label: string }[];
    defaultValue?: any;
    editable?: boolean;
    visible?: boolean;
}

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
  // Initialize state using defaultValue, or fallback values based on type
  const initialState = Object.fromEntries(
    fields.map((f) => {
      let fallback = "";
      if (f.type === "number" || f.type === "boolean") fallback = f.defaultValue ?? 0;
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onCreateSuccess();
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TableRow className="bg-muted/40">
      {idPlaceholder !== "hide" && (
        <TableCell className="text-muted-foreground italic">
          {idPlaceholder}
        </TableCell>
      )}

      {fields
        .filter((f) => f.visible !== false)
        .map((field) => (
          <TableCell key={field.key}>
            {field.editable === false && (
              <span className="text-muted-foreground italic">auto</span>
            )}

            {field.editable !== false && field.type === "text" && (
              <Input
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
              />
            )}

            {field.editable !== false && field.type === "number" && (
              <Input
                type="number"
                value={form[field.key]}
                onChange={(e) => update(field.key, Number(e.target.value))}
              />
            )}

            {/* Generic Boolean Handler */}
            {field.editable !== false && field.type === "boolean" && (
              <Select
                value={String(form[field.key] ?? "0")}
                onValueChange={(v) => update(field.key, Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            )}

            {field.editable !== false && field.type === "select" && (
              <Select
                value={String(form[field.key] ?? "")}
                onValueChange={(v) => update(field.key, Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={String(opt.id)} value={String(opt.id)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </TableCell>
        ))}
      <TableCell className="text-right">
        <EditableRowActions 
          onSave={save} 
          onCancel={onCancel} 
          isSaving={saving} 
        />
      </TableCell>
    </TableRow>
  );
}