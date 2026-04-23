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
} from "@/components/ui/table";

export function SportsTable({ sports }: { sports: Sport[] }) {
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
            <TableRow key={sport.sport_id}>
              <TableCell>{sport.sport_id}</TableCell>
              <TableCell className="font-medium">{sport.sport_name}</TableCell>
              <TableCell>{sport.category_id}</TableCell>
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
