import { ReferenceValue } from "./referencevalue";

export interface League {
  league_id: number;
  league_name: string;
  sport_id: number;
  level: number;
  country_id: number;
  country: ReferenceValue; // ← nested object
}