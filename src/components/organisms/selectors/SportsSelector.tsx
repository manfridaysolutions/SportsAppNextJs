"use client";

import { querySports } from "@/hooks/querySports";
import { BaseSelector } from "../BaseSelector";
import { Sport } from "@/types/sport";

interface SportSelectorProps {
  /** The current sport_id from the URL or state to highlight the selection */
  selectedSport?: Sport | null,
  /** Callback to parent to handle navigation or state updates */
  onSelect: (sport: Sport) => void;
  /** Optional styling for the button width/layout */
  className?: string;
}

export function SportsSelector({ 
  selectedSport,
  onSelect, 
  className = "w-[220px]" 
}: SportSelectorProps) {
  
  // 1. Fetch data locally within the selector
  const { data: sports = [], isLoading } = querySports();

  return (
    <BaseSelector
      items={sports}
      selectedId={selectedSport?.sport_id}
      onSelect={onSelect}
      idKey="sport_id"
      labelKey="sport_name"
      // Show loading state directly in the placeholder
      placeholder={isLoading ? "Loading sports..." : "Select Sport"}
      searchPlaceholder="Search sports..."
      className={className}
      // Keep sorting consistent across the app
      sortBy="sport_name"
      sortOrder="asc"
    />
  );
}