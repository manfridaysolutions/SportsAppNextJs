import { ReferenceValue } from "./referencevalue";

export interface Team {
  team_id: number;
  team_name: string;
  league_id: number;
  short_name: string | null;
  abbreviation: string | null;
  city: string | null;
  state_province: string | null;
  country: string | null;
  venue_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  founded_year: number | null;
  is_active: boolean;
}