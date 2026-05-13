import { BaseSelector } from "../BaseSelector";
import { League } from "@/types/league";
import { Season } from "@/types/season";
import { querySeasons } from "@/hooks/querySeasons";
import { Spinner } from "@/components/atoms/Spinner";

interface SeasonsSelectorProps {
    league: League | null | undefined;
    selectedSeason: Season | null;
    onSelect: (season: Season) => void;
}

export const SeasonsSelector = ({ league, selectedSeason, onSelect }: SeasonsSelectorProps) => {
    const { data: seasons = [], isLoading } = querySeasons(league?.league_id ?? null);

    return (
        <div className="relative">
            {isLoading && <Spinner size="sm" className="absolute right-2 top-2" />}
            <BaseSelector
                items={seasons}
                selectedId={selectedSeason?.season_id}
                onSelect={onSelect}
                idKey="season_id"
                labelKey="season_year"
                sortBy="start_date"
                sortOrder="desc"
                placeholder="Select Season"
            />
        </div>
    );
};