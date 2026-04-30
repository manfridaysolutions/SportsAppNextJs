"use client";

import { apiGet } from "@/lib/api";
import { ReferenceValue } from "@/types/referencevalue";
import { ReferenceCategory } from "@/types/referencecategory";
import { useState, useEffect, useCallback } from "react";
import { useReferenceCategories } from "@/hooks/useReferenceCategories";
import { ReferenceCategoriesTable } from "@/components/templates/ReferenceCategoriesTable";
import { ReferenceValuesTable } from "@/components/templates/ReferenceValuesTable";

export default function ReferencesPage() {
    const [selectedReferenceCategoryId, setSelectedReferenceCategoryId] = useState<number | null>(null);

    return (
        <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold tracking-tight">Reference Management</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 items-start">
                <ReferenceCategoriesTable
                    onSelectCategory={(id) => setSelectedReferenceCategoryId(id)}
                    selectedId={selectedReferenceCategoryId}
                />
                <ReferenceValuesTable
                    selectedReferenceCategoryId={selectedReferenceCategoryId}
                />
            </div>
        </div>
    );
}
