"use client";

import { useState } from "react";
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead } from "../ui/table";
import { CreateRow } from "./CreateRow";
import { EditableRow2 } from "./EditableRow2";
import { AddButton } from "../atoms/ActionButtons";

interface BaseDataTable2Props<T> {
  title: string;
  caption: string;
  items: T[];
  isLoading: boolean;
  idField: string;
  idPlaceholder?: string;
  endpoint: string;
  onRefresh: () => void;
  fields: any[];
  addLabel: string;
  headers: string[];
  referenceData?: Record<string, any[]>;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

export function BaseDataTable2<T extends Record<string, any>>({
  title,
  caption,
  items,
  isLoading,
  idField,
  idPlaceholder = "auto",
  endpoint,
  onRefresh,
  fields,
  addLabel,
  headers,
  referenceData,
  selectedId,
  onSelect,
}: BaseDataTable2Props<T>) {
  const [creating, setCreating] = useState(false);

  const refData = referenceData ?? {};

  const isRefLoading = referenceData !== undefined && Object.keys(referenceData).length === 0;

  if (isRefLoading) {
    return <div className="p-4 text-sm text-muted-foreground animate-pulse">Loading required data...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

      {isLoading ? (
        <p className="text-xs text-blue-500 animate-pulse">Fetching {title.toLowerCase()}...</p>
      ) : (
        <div className="w-full overflow-x-auto p-4 shadow-sm border rounded-lg">
          <Table>
            <TableCaption>{caption}</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {headers.map((h) => <TableHead key={h}>{h}</TableHead>)}
                <TableHead className="text-right">
                  <AddButton
                    label={addLabel}
                    onClick={() => setCreating(true)}
                    className="mb-0 py-1 px-3 text-xs inline-flex"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creating && (
                <CreateRow
                  endpoint={endpoint}
                  idPlaceholder={idPlaceholder}
                  onCreateSuccess={() => {
                    setCreating(false);
                    onRefresh();
                  }}
                  onCancel={() => setCreating(false)}
                  fields={fields}
                />
              )}
              {items.map((item) => (
                <EditableRow2
                  key={item[idField]}
                  record={item}
                  idField={idField}
                  endpoint={endpoint}
                  onRefresh={onRefresh}
                  fields={fields}
                  idPlaceholder={idPlaceholder}
                  onClick={onSelect ? () => onSelect(item[idField]) : undefined}
                  className={onSelect ? `cursor-pointer transition-colors ${selectedId === item[idField] ? "bg-muted font-medium" : "hover:bg-muted/50"
                    }` : ""}
                >
                </EditableRow2>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}