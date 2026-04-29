"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { EditableRow } from "../organisms/EditableRow";
import { EditableCell } from "../organisms/EditableCell";
import { CreateRow } from "../organisms/CreateRow";
import { AddButton, EditButton } from "../atoms/ActionButtons";

export function SportsTable({
  sports,
  referenceData,
  selectedId,
  onSelectSport,
  onRefresh,
}: {
  sports: any[];
  referenceData: Record<string, any[]>;
  selectedId: number | null;
  onSelectSport: (id: number) => void;
  onRefresh: () => void;
}) {
  const [creating, setCreating] = useState(false);

  // Guard for reference data
  if (!referenceData) return <div>Loading reference data...</div>;

  // Pulling options for categories if you have them in referenceData
  const sport_categories = referenceData["SportCategory"] ?? [];

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
            <TableHead className="text-right">
              <AddButton
                label="Sport"
                onClick={() => setCreating(true)}
                className="mb-0 py-1 px-3 text-xs inline-flex"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creating && (
            <CreateRow
              endpoint="/api/v1/sports/"
              onCreateSuccess={() => {
                setCreating(false);
                onRefresh();
              }}
              onCancel={() => setCreating(false)}
              fields={[
                { key: "sport_name", label: "Name", type: "text" },
                {
                  key: "category_id",
                  label: "Category",
                  type: "select",
                  options: sport_categories.map(c => ({
                    id: c.reference_value_id,
                    label: c.value
                  }))
                },
                { 
                  key: "is_team_sport", 
                  label: "Team Sport", 
                  type: "select", 
                  options: [
                    { id: 1, label: "Yes" },
                    { id: 0, label: "No" }
                  ],
                  defaultValue: "Yes" 
                },
                { key: "governing_body", label: "Governing Body", type: "text" },
                { key: "description", label: "Description", type: "text" },
              ]}
            />
          )}

          {sports.map((sport) => (
            <EditableRow
              key={sport.sport_id}
              record={sport}
              idField="sport_id"
              endpoint="/api/v1/sports/"
              onRefresh={onRefresh}
              // 1. Capture the click
              onClick={() => onSelectSport(sport.sport_id)}
              // 2. Add visual feedback (cursor and highlight)
              className={`cursor-pointer transition-colors ${selectedId === sport.sport_id
                ? "bg-muted font-medium hover:bg-muted"
                : "hover:bg-muted/50"
                }`}
            >
              {(data, update, isEditing) => (
                <>
                  <TableCell>{sport.sport_id}</TableCell>

                  {/* Name */}
                  <TableCell>
                    <EditableCell
                      isEditing={isEditing}
                      value={data.sport_name}
                      renderInput={() => (
                        <Input
                          value={data.sport_name}
                          onChange={(e) => update("sport_name", e.target.value)}
                          className="h-8"
                        />
                      )}
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <EditableCell
                      isEditing={isEditing}
                      value={data.category_id}
                      renderInput={() => (
                        <Select
                          value={data.category_id ? String(data.category_id) : ""}
                          onValueChange={(newValue) => {
                            // Call the FastAPI update endpoint
                            update("category_id", newValue === "" ? null : Number(newValue));
                          }}
                        >
                          <SelectTrigger className="w-[180px] h-8">
                            <SelectValue placeholder="Select category">
                              {sport_categories.find(c => String(c.reference_value_id) === String(data.category_id))?.value}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {sport_categories.map((c) => (
                              <SelectItem
                                key={c.reference_value_id}
                                value={String(c.reference_value_id)}
                              >
                                {c.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        // <Input
                        //   defaultValue={data.category_id}
                        //   onChange={(e) => update("category_id", e.target.value)}
                        //   className="h-8"
                        // />
                      )}
                      renderDisplay={() => (
                        <span>{sport.sport_category.value ?? "N/A"}</span>
                      )}
                    />
                  </TableCell>

                  {/* Team Sport */}
                  <TableCell>
                    <EditableCell
                      isEditing={isEditing}
                      value={data.is_team_sport}
                      renderInput={() => (
                        <Select
                          value={String(data.is_team_sport)}
                          onValueChange={(val) => update("is_team_sport", val)}
                        >
                          <SelectTrigger className="h-8 w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      renderDisplay={() => (
                        <span>{sport.is_team_sport ? "Yes" : "No"}</span>
                      )}
                    />
                  </TableCell>

                  {/* Governing Body */}
                  <TableCell>
                    <EditableCell
                      isEditing={isEditing}
                      value={data.governing_body}
                      renderInput={() => (
                        <Input
                          value={data.governing_body}
                          onChange={(e) => update("governing_body", e.target.value)}
                          className="h-8"
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      isEditing={isEditing}
                      value={data.description}
                      renderInput={() => (
                        <Input
                          value={data.description}
                          onChange={(e) => update("description", e.target.value)}
                          className="h-8"
                        />
                      )}
                    />
                  </TableCell>
                  {/* Action Cell handled by EditableRow logic */}
                </>
              )}
            </EditableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}