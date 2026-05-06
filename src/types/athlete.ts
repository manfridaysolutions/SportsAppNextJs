import { AthleteSport } from "./athletesport";
import { Roster } from "./roster";
import { ReferenceValue } from "./referencevalue";

export interface Athlete {
  athlete_id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  country_id: number | null;
  weight_lbs: number | null;
  source_reference_id: string | null;
  height_inches: number | null;
  birth_date: string | null;
  is_active: boolean;
  rosters: Roster[];
  athlete_sports: AthleteSport[];
  nationality: ReferenceValue;
}