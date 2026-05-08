"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAthletesBySport, useSportDetail, useReferenceValuesForCategories } from "@/hooks/useQuery";

import { AthletesTable, REF_REQUIREMENTS_ATHLETES } from "@/components/templates/AthletesTable";
import { ContractsTable, REF_REQUIREMENTS_CONTRACTS } from "@/components/templates/ContractsTable";
import { QuerystringValidator } from "@/components/molecules/QuerystringValidator";

import { Athlete } from "@/types/athlete";

const DYNAMIC_REF_KEYS = Array.from(new Set([
    ...REF_REQUIREMENTS_ATHLETES,
    ...REF_REQUIREMENTS_CONTRACTS
]));

export default function AthletesPage() {
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

    const searchParams = useSearchParams();
    const sport_id = searchParams.get("sport_id") ? Number(searchParams.get("sport_id")) : null;

    // Validate the sport_id passed in exists
    const { data: sport, isLoading: isInitialLoading } = useSportDetail(sport_id); // Check global loading

    const { data: athletes = [], refetch, isLoading: isLoadingAthletes } = useAthletesBySport(sport_id);
    const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

    // 3. Consolidated Syncing State
    const isSyncing = isLoadingAthletes || isLoadingRef;

    return (
        <QuerystringValidator
            id={sport_id}
            data={sport}
            isLoading={isInitialLoading}
            entityName="Sport"
            returnPath="/sports"
        >
            <div className="min-h-screen p-6 bg-background text-foreground transition-colors duration-300">
                <header className="flex justify-between items-center mb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {sport?.sport_name} Roster
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Managing athletes and contracts for {sport?.governing_body}
                        </p>
                    </div>

                    {isSyncing && (
                        <span className="text-sm text-muted-foreground animate-pulse">
                            Syncing athletes...
                        </span>
                    )}
                </header>

                <AthletesTable
                    sport={sport!} // Non-null assertion safe due to QueryValidator
                    referenceData={referenceData}
                    onSelectAthlete={(athlete) => setSelectedAthlete(athlete)}
                    selectedAthlete={selectedAthlete}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Positions Column */}
                    <ContractsTable
                        referenceData={referenceData}
                        athlete={selectedAthlete}
                    />
                </div>

            </div>
        </QuerystringValidator>
    )
}