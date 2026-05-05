"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell
} from "../ui/table";
import { CreateRow } from "./CreateRow";
import { EditableRow } from "./EditableRow";
import { AddButton } from "../atoms/ActionButtons";
import { useSortableData, } from "@/hooks/useSortableData";
import { usePagination } from "@/hooks/usePagination";
import { useFilter } from "@/hooks/useFilter";
import { TablePagination } from "../molecules/TablePagination";
import { SearchInput } from "../molecules/SearchInput";

interface BaseDataTableProps<T> {
  title: string;
  caption: string;
  items: T[];
  itemsPerPage?: number;
  isLoading: boolean;
  idField: string;
  idPlaceholder?: string;
  endpoint: string;
  onRefresh: () => void;
  fields: any[];
  addLabel: string;
  headers?: string[]; // Optional: will use field labels if not provided
  referenceData?: Record<string, any[]>;
  selectedId?: number | null;
  showRowsPerPage?: boolean; // Pass-through prop
  onSelect?: (id: number) => void;
}

export function BaseDataTable<T extends Record<string, any>>({
  title,
  itemsPerPage: initialLimit = 10,
  caption,
  items,
  isLoading,
  idField,
  idPlaceholder = "auto",
  endpoint,
  onRefresh,
  fields,
  addLabel,
  referenceData,
  selectedId,
  showRowsPerPage = false,
  onSelect
}: BaseDataTableProps<T>) {
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Identify searchable keys from your fields prop
  const searchableKeys = useMemo(() =>
    fields.filter(f => f.searchable !== false).map(f => f.key),
    [fields]);

  // 2. Filter the raw data first
  const filteredItems = useFilter(items, searchTerm, searchableKeys);

  // 3. Pass filtered data to the sort hook
  const { items: sortedItems, requestSort, sortConfigs } = useSortableData(filteredItems);

  // 4. Pass sorted/filtered data to the pagination hook
  const {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    initialItemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    startIndex
  } = usePagination(sortedItems, initialLimit);

  const isRefLoading = referenceData !== undefined && Object.keys(referenceData).length === 0;

  if (isRefLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground animate-pulse">
        Loading required data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* COMPACT HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        {/* Title Group */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight whitespace-nowrap">{title}</h2>
          {/* Inline Pagination (Hidden if only 1 page) */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            initialItemsPerPage={initialItemsPerPage}
            totalItems={sortedItems.length}
            startIndex={startIndex}
            onPageChange={setCurrentPage}
            onLimitChange={setItemsPerPage}
            showRowsPerPage={showRowsPerPage}
          />
        </div>
        <div className="flex items-center gap-6">
          {/* Pagination is now an inline utility in the header */}

          {/* Actions Group (Search + Add Button) */}
          <div className="flex items-center gap-3 w-full md:w-auto"></div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:w-32"
          />
          {/* If your AddButton was here, it would align nicely as the last item */}
        </div>
      </div>

      {
        isLoading ? (
          <p className="text-xs text-blue-500 animate-pulse">Fetching {title.toLowerCase()}...</p>
        ) : (
          <div className="w-full overflow-x-auto shadow-sm border rounded-lg bg-background">
            <Table>
              {/* <TableCaption>{caption}</TableCaption> */}
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {fields
                    .filter((f) => f.visible !== false)
                    .map((field) => {
                      // Find if this field is being sorted and at what priority
                      const sortIndex = sortConfigs.findIndex((s) => s.key === field.key);
                      const currentSort = sortConfigs[sortIndex];

                      return (
                        <TableHead
                          key={field.key}
                          // Pass the shiftKey boolean to the hook
                          onClick={(e) => requestSort(field.key, e.shiftKey)}
                          className="cursor-pointer select-none hover:text-foreground transition-colors group"
                        >
                          <div className="flex items-center gap-1">
                            <span>{field.label}</span>
                            <div className="flex items-center text-[10px] font-mono">
                              <span className="text-muted-foreground w-3">
                                {currentSort
                                  ? (currentSort.order === "asc" ? "↑" : "↓")
                                  : "↕"
                                }
                              </span>
                              {/* Show priority number if more than one column is sorted */}
                              {sortConfigs.length > 1 && sortIndex !== -1 && (
                                <span className="bg-muted px-1 rounded text-primary-foreground">
                                  {sortIndex + 1}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableHead>
                      );
                    })}
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
                {/* Use sortedItems here to reflect sorting changes */}
                {paginatedItems.map((item) => (
                  <EditableRow
                    key={item[idField]}
                    record={item}
                    idField={idField}
                    endpoint={endpoint}
                    onRefresh={onRefresh}
                    fields={fields}
                    idPlaceholder={idPlaceholder}
                    onClick={onSelect ? () => onSelect(item[idField]) : undefined}
                    className={
                      onSelect
                        ? `cursor-pointer transition-colors ${selectedId === item[idField]
                          ? "bg-muted font-medium"
                          : "hover:bg-muted/50"
                        }`
                        : ""
                    }
                  />
                ))}


              </TableBody>
            </Table>
          </div>
        )
      }
    </div >
  );
}