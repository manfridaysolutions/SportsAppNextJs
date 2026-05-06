"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ModelSelectorProps<T> {
  items: T[];
  selectedId?: number | null;
  onSelect: (id: any) => void;
  idKey: keyof T;
  labelKey: keyof T;
  sortBy?: keyof T; // New: specifying the sort field
  sortOrder?: "asc" | "desc"; // New: direction
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function ModelSelector<T>({
  items,
  selectedId,
  onSelect,
  idKey,
  labelKey,
  sortBy,
  sortOrder = "asc",
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  className = "w-[200px]",
}: ModelSelectorProps<T>) {
  const [open, setOpen] = React.useState(false)

  // 1. Sort the items before rendering
  const sortedItems = React.useMemo(() => {
    const sortField = sortBy || labelKey; // Default to labelKey if no sortBy provided
    
    return [...items].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortBy, labelKey, sortOrder]);

  const selectedItem = items.find((item) => item[idKey] === selectedId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("justify-between text-xs h-8 font-medium bg-background", className)}
        >
          {selectedItem ? String(selectedItem[labelKey]) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 shadow-md", className)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-8 text-xs" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {/* 2. Use sortedItems here */}
            {sortedItems.map((item) => {
              const id = item[idKey];
              const label = String(item[labelKey]);
              
              return (
                <CommandItem
                  key={String(id)}
                  value={label}
                  onSelect={() => {
                    onSelect(id)
                    setOpen(false)
                  }}
                  className="text-xs cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}