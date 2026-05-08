import { Athlete } from "./athlete";
import { Team } from "./team";
import { Season } from "./season";
import { ReferenceValue } from "./referencevalue";

export interface Contract {
  contract_id: number;
  athlete_id: number;
  team_id: number;
  start_season_id: number;
  end_season_id: number;
  signed_date: string; // ISO date string: "2026-05-07"
  total_value: string; // Decimal returned as string: "0.00"
  guaranteed_amount: string;
  contract_type_id: number;
  is_active: boolean;
  details: Record<string, any>;
  
  // Nested Relations
  athlete: Athlete;
  team: Team;
  start_season: Season;
  end_season: Season;
  contract_type: ReferenceValue;
}

// export interface ContractCreate {
//   athlete_id: number;
//   team_id: number;
//   start_season_id: number;
//   end_season_id: number;
//   signed_date?: string;
//   total_value?: number;
//   guaranteed_amount?: number;
//   contract_type?: string;
//   is_active?: boolean;
//   details?: Record<string, any>;
// }

// export interface ContractUpdate extends Partial<ContractCreate> {}