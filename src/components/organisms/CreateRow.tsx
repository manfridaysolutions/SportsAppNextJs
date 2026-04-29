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

interface FieldDef {
    key: string;
    label: string;
    type: "text" | "number" | "select";
    options?: { id: number; label: string }[];
    defaultValue?: any;
    editable?: boolean; // NEW
    visible?: boolean; // NEW
}

interface CreateRowProps {
    fields: FieldDef[];
    endpoint: string;
    onCreateSuccess: () => void;
    onCancel: () => void;
    idPlaceholder?: string | number; // NEW: allow custom placeholder for the ID cell
}

export function CreateRow({
  fields,
  endpoint,
  onCreateSuccess,
  onCancel,
  idPlaceholder = "auto",   // NEW
}: CreateRowProps) {
  const initialState = Object.fromEntries(
    fields.map((f) => [f.key, f.defaultValue ?? ""])
  );

  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    onCreateSuccess();
  };

  return (
    <TableRow className="bg-muted/40">

      {/* ⭐ ID placeholder cell */}
      <TableCell className="text-muted-foreground italic">
        {idPlaceholder}
      </TableCell>

      {/* Render all visible fields */}
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
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </TableCell>
        ))}
      <TableCell>
        <EditableRowActions 
          onSave={save} 
          onCancel={onCancel} 
          isSaving={saving} 
        />
      </TableCell>
    </TableRow>
  );
}

