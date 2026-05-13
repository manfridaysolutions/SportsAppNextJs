"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAthletesBySport, useSports, useReferenceValuesForCategories } from "@/hooks/useQuery";

import { AthletesTable, REF_REQUIREMENTS_ATHLETES } from "@/components/templates/AthletesTable";
import { ContractsTable, REF_REQUIREMENTS_CONTRACTS } from "@/components/templates/ContractsTable";
import { QuerystringValidator } from "@/components/molecules/QuerystringValidator";
import { SportsSelector } from "@/components/organisms/selectors/SportsSelector";

import { Sport } from "@/types/sport";
import { Athlete } from "@/types/athlete";

const DYNAMIC_REF_KEYS = Array.from(new Set([
    ...REF_REQUIREMENTS_ATHLETES,
    ...REF_REQUIREMENTS_CONTRACTS
]));

export default function AthletesPage() {
    const router = useRouter(); // Initialize router
    const searchParams = useSearchParams();
    
    // 1. Get raw ID from URL
    const sport_id = searchParams.get("sport_id") ? Number(searchParams.get("sport_id")) : null;

    // 2. Fetch shared data
    const { data: sports = [], isLoading: isInitialLoading } = useSports();
    const { data: referenceData = {}, isLoading: isLoadingRef } = useReferenceValuesForCategories(DYNAMIC_REF_KEYS);

    // 3. Athlete-specific data (only fires if sport_id exists)
    const { data: athletes = [], refetch, isLoading: isLoadingAthletes } = useAthletesBySport(sport_id);
    
    // 4. Local state for drill-down selection
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

    // 5. Derive the current sport object from the URL ID
    const sport = useMemo(() => {
        if (!sports || !sport_id) return null;
        return sports.find((s) => s.sport_id === sport_id) || null;
    }, [sports, sport_id]);    

    const handleSportChange = (sport: Sport) => {
        router.push(`/athletes?sport_id=${sport.sport_id}`);
    };

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
                            Athletes of
                            <SportsSelector
                                selectedSport={sport}
                                onSelect={handleSportChange}
                            /> 
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
                    onSelectAthlete={setSelectedAthlete}
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