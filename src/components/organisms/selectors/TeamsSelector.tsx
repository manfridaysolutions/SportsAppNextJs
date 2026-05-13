import { BaseSelector } from "../BaseSelector";
import { Team } from "@/types/team";
import { League } from "@/types/league";
import { queryTeams } from "@/hooks/queryTeams";
import { Spinner } from "@/components/atoms/Spinner";

interface TeamsSelectorProps {
    league: League | null | undefined;
    selectedTeam: Team | null;
    onSelect: (team: Team) => void;
}

export const TeamsSelector = ({ league, selectedTeam, onSelect }: TeamsSelectorProps) => {
    const { data: teams = [], isLoading } = queryTeams(league?.league_id ?? null);

    return (
        <div className="relative">
            {isLoading && <Spinner size="sm" className="absolute right-2 top-2" />}
            <BaseSelector
                items={teams}
                selectedId={selectedTeam?.team_id}
                onSelect={onSelect}
                idKey="team_id"
                labelKey="team_name"
                sortBy="team_name"
                sortOrder="asc"
                placeholder="Select Team"
            />
        </div>
    );
};