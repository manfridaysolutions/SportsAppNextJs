import { Team } from "./team";
import { Athlete } from "./athlete";
import { RosterPosition } from "./rosterposition";

export interface Roster {
  roster_id: number;
  athlete_id: number;
  team_id: number;
  season_id: number;
  is_primary_sport: boolean;
  status: string;
  jersey_number: string;
  team: Team;
  athlete: Athlete
  roster_positions: RosterPosition[]
}