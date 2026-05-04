import { ReferenceValue } from "./referencevalue";

export interface StatDefinition {
  stat_def_id: number;
  stat_name: string;
  stat_abbreviation: string | null;
  sport_id: number;
  stat_unit_id: number;
  stat_unit: ReferenceValue; // ← nested object
}