"use client";
import { useState } from "react";
import { ReferenceCategoriesTable } from "@/components/templates/ReferenceCategoriesTable";
import { ReferenceValuesTable } from "@/components/templates/ReferenceValuesTable";

import { ReferenceCategory } from "@/types/referencecategory";

export default function ReferencesPage() {
    const [selectedReferenceCategory, setSelectedReferenceCategory] = useState<ReferenceCategory | null>(null);

    return (
        <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold tracking-tight">Reference Management</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 items-start">
                <ReferenceCategoriesTable
                    onSelectCategory={(referenceCategory) => setSelectedReferenceCategory(referenceCategory)}
                    selectedReferenceCategory={selectedReferenceCategory}
                />
                <ReferenceValuesTable
                    reference_Category={selectedReferenceCategory}
                />
            </div>
        </div>
    );
}
