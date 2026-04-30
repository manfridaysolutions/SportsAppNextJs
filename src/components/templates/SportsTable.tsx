"use client";

import { BaseDataTable } from "../organisms/BaseDataTable";
import { TableCell } from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { EditableCell } from "../organisms/EditableCell";

import { useSports } from "@/hooks/useSports";

export function SportsTable({ referenceData, selectedId, onSelectSport }: {
  referenceData: Record<string, any[]>;
  selectedId: number | null;
  onSelectSport: (id: number) => void;
}) {
  const { data: sports = [], refetch, isLoading } = useSports();
  
  const filteredRefData = referenceData && referenceData["SportCategory"]
    ? { SportCategory: referenceData["SportCategory"] } 
    : undefined;

  const sport_categories = referenceData?.["SportCategory"] ?? [];

return (
    <BaseDataTable
      title="Sports"
      caption="A list of all sports in the system"
      items={sports}
      isLoading={isLoading} // Assuming sports are passed in as props, loading handled by parent
      referenceData={filteredRefData}
      idField="sport_id"
      endpoint="/api/v1/sports/"
      onRefresh={refetch}
      addLabel="Sport"
      selectedId={selectedId}
      onSelect={onSelectSport}
      headers={["ID", "Name", "Category", "Team Sport", "Governing Body", "Description"]}
      createFields={[
        { key: "sport_name", label: "Name", type: "text" },
        {
          key: "category_id",
          label: "Category",
          type: "select",
          options: sport_categories.map((c) => ({
            id: c.reference_value_id,
            label: c.value,
          })),
        },
        {
          key: "is_team_sport",
          label: "Team Sport",
          type: "select",
          options: [
            { id: 1, label: "Yes" },
            { id: 0, label: "No" },
          ],
          defaultValue: 1,
        },
        { key: "governing_body", label: "Governing Body", type: "text" },
        { key: "description", label: "Description", type: "text" },
      ]}
    >
      {(data, update, isEditing, refData) => {
        const rowCategories = refData["SportCategory"] ?? [];
        
        return (
          <>
            <TableCell className="font-mono text-xs">{data.sport_id}</TableCell>

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
                    onValueChange={(val) => update("category_id", val === "" ? null : Number(val))}
                  >
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Category">
                        {rowCategories.find(c => String(c.reference_value_id) === String(data.category_id))?.value}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {rowCategories.map((c) => (
                        <SelectItem key={c.reference_value_id} value={String(c.reference_value_id)}>
                          {c.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                renderDisplay={() => <span>{data.sport_category?.value ?? "N/A"}</span>}
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
                    onValueChange={(val) => update("is_team_sport", val === "true")}
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
                renderDisplay={() => <span>{data.is_team_sport ? "Yes" : "No"}</span>}
              />
            </TableCell>

            {/* Governing Body */}
            <TableCell>
              <EditableCell
                isEditing={isEditing}
                value={data.governing_body}
                renderInput={() => (
                  <Input
                    value={data.governing_body || ""}
                    onChange={(e) => update("governing_body", e.target.value)}
                    className="h-8"
                  />
                )}
              />
            </TableCell>

            {/* Description */}
            <TableCell>
              <EditableCell
                isEditing={isEditing}
                value={data.description}
                renderInput={() => (
                  <Input
                    value={data.description || ""}
                    onChange={(e) => update("description", e.target.value)}
                    className="h-8"
                  />
                )}
              />
            </TableCell>
          </>
        );
      }}
    </BaseDataTable>
  );
}