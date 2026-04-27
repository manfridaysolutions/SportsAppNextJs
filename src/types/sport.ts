export interface SportCategory {
  description: string | null;
  metadata_field: string | null;
  reference_value_id: number;
  value: string;
  reference_category_id: number;
  sort_order: number;
}

export interface Sport {
  sport_id: number;
  sport_name: string;
  category_id: number;
  is_team_sport: boolean;
  governing_body: string;
  description: string;
  sport_category: SportCategory; // ← nested object
}