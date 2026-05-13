import { BaseSelector } from "../BaseSelector";
import { Sport } from "@/types/sport";
import { League } from "@/types/league";
import { Season } from "@/types/season";
import { useSeasons, useLeaguesBySport } from "@/hooks/useQuery";
import { Spinner } from "@/components/atoms/Spinner";

interface LeaguesSelectorProps {
    sport: Sport | null | undefined;
    selectedLeague: League | null | undefined;
    onSelect: (league: League) => void;
}

export const LeaguesSelector = ({ sport, selectedLeague, onSelect }: LeaguesSelectorProps) => {
    const { data: leagues = [], isLoading } = useLeaguesBySport(sport?.sport_id ?? null);

    return (
        <div className="relative">
            {isLoading && <Spinner size="sm" className="absolute right-2 top-2" />}
            <BaseSelector
                items={leagues}
                selectedId={selectedLeague?.league_id}
                onSelect={onSelect}
                idKey="league_id"
                labelKey="league_name"
                sortBy="league_name"
                sortOrder="asc"
                placeholder="Select League"
            />
        </div>
    );
};