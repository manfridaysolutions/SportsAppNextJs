// components/table/RowActions.tsx
"use client";

import { Button } from "@/components/ui/button";

interface ReadonlyRowActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export function ReadonlyRowActions({ onEdit, onDelete }: ReadonlyRowActionsProps) {
    return (
        <div className="flex items-center gap-2">
            < Button
                variant="ghost"
                size="icon"
                onClick={onEdit}>
                Edit
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={onDelete}>
                Delete
            </Button>
        </div>
    );
}
