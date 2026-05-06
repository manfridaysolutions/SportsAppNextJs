import { League } from "./league";

export interface Season {
  season_id: number;
  league_id: number;
  season_year: string;
  start_date: string; // ISO format: YYYY-MM-DD
  end_date: string;   // ISO format: YYYY-MM-DD
  is_active: boolean;
  league: League;
}