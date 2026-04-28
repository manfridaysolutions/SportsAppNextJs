"use client";

import { Sport } from "@/types/sport";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Update the props interface to include the selection logic
interface SportsTableProps {
  referenceData: Record<string, any[]>; // Add this line to receive reference data
  sports: Sport[];
  selectedId: number | null;
  onSelectSport: (id: number) => void;
}

export function SportsTable({ referenceData, sports, selectedId, onSelectSport }: SportsTableProps) {


  return (
    <div className="w-full overflow-x-auto p-4">
      <Table>
        <TableCaption>A list of all sports in the system</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Team Sport</TableHead>
            <TableHead>Governing Body</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sports.map((sport) => (
            <TableRow key={sport.sport_id}
            // 1. Capture the click
              onClick={() => onSelectSport(sport.sport_id)}
              // 2. Add visual feedback (cursor and highlight)
              className={`cursor-pointer transition-colors ${
                selectedId === sport.sport_id 
                  ? "bg-muted font-medium hover:bg-muted" 
                  : "hover:bg-muted/50"
              }`}
            >
              <TableCell>{sport.sport_id}</TableCell>
              <TableCell className="font-medium">{sport.sport_name}</TableCell>
              <TableCell>{sport.sport_category.value}</TableCell>
              <TableCell>
                {sport.is_team_sport ? "Yes" : "No"}
              </TableCell>
              <TableCell>{sport.governing_body}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {sport.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
