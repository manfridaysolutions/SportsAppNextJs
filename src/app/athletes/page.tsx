"use client";

import { useReferenceValuesForCategories } from "@/hooks/useReferenceValuesForCategories";

import { ModelSelector } from "@/components/molecules/ModelSelector";
import { useAthletesBySport } from "@/hooks/useAthletes";

import { AthletesTable, REF_REQUIREMENTS_ATHLETES } from "@/components/templates/AthletesTable";

import { useSearchParams } from "next/navigation";

const DYNAMIC_REF_KEYS = Array.from(new Set([
    ...REF_REQUIREMENTS_ATHLETES
]));

export default function AthletesPage() {
    const searchParams = useSearchParams();

    const sport_id = Number(searchParams.get("sport_id"));

    const { data: athletes = [], refetch, isLoading } = useAthletesBySport(sport_id);
    const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

    return (
        <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold tracking-tight">Sports Management</h1>
                {(isLoading || isLoadingRef) && (
                    <span className="text-sm text-muted-foreground animate-pulse">Syncing...</span>
                )}
            </header>

            <AthletesTable
                sport_id={sport_id}
                referenceData={referenceData}
            />
        </div>
    )

}