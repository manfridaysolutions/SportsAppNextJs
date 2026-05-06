// components/molecules/UniversalSelect.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  id: string | number;
  label: string;
}

interface ComboBoxEditor {
  options: Option[];
  value: string | number | (string | number)[]; // Update value type as well
  onChange: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
}

export function ComboBoxEditor({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = false
}: ComboBoxEditor) {
  const [open, setOpen] = React.useState(false);

  // Helper to ensure we are always working with an array internally for the UI
  const selectedArray = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }, [value]);

  const handleSelect = (id: string | number) => {
    if (isMulti) {
      const current = Array.isArray(value) ? value : [];
      // Standardize comparison by converting to String if necessary, 
      // or keep as-is if you trust the data types are consistent
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      onChange(updated);
    } else {
      onChange(id);
      setOpen(false);
    }
  };

  const handleUnselect = (id: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMulti) {
      // Assert as (string | number)[] to match the new value type
      const currentValues = (value as (string | number)[]) || [];
      onChange(currentValues.filter((i) => i !== id));
    } else {
      onChange(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto min-h-8 py-1 px-2 text-xs"
        >
          <div className="flex flex-wrap gap-1">
            {selectedArray.length > 0 ? (
              selectedArray.map((id) => (
                <Badge key={id} variant="secondary" className="text-[10px]">
                  {options.find((o) => o.id === id)?.label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => handleUnselect(id, e)}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[100]">
        <Command>
          <CommandInput placeholder="Search..." className="h-8" />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {options.map((option) => (
              <CommandItem key={option.id} onSelect={() => handleSelect(option.id)}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedArray.includes(option.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}