"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ value, onChange }: { value?: string; onChange: (date: string) => void }) {
    const [inputValue, setInputValue] = React.useState(value || "");

    React.useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleManualEntry = (v: string) => {
        setInputValue(v);
        const formats = ["MM-dd-yyyy", "MM/dd/yyyy", "yyyy-MM-dd"];
        for (const f of formats) {
            const attempt = parse(v, f, new Date());
            if (isValid(attempt)) {
                onChange(format(attempt, "yyyy-MM-dd"));
                break;
            }
        }
    };

    return (
        <div className="flex gap-1 items-center w-full">
            <Input
                className="h-8 text-xs flex-1"
                placeholder="MM-DD-YYYY"
                value={inputValue}
                onChange={(e) => handleManualEntry(e.target.value)}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 px-0 shrink-0">
                        <CalendarIcon className="h-3 w-3" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={value ? new Date(value + "T00:00:00") : undefined}
                        onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
                        // Set to "label" for now to avoid the broken dropdowns
                        captionLayout="label" 
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}