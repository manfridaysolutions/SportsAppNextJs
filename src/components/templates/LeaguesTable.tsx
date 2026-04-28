"use client";

import { League } from "@/types/league";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { EditableRow } from "../organisms/EditableRow";
import { EditableCell } from "../organisms/EditableCell";
import { CreateRow } from "../organisms/CreateRow";
import { AddButton } from "../atoms/ActionButtons";
import { useState } from "react";

export function LeaguesTable({
    referenceData,
    leagues,
    onRefresh,
    selectedSportId, // NEW: receive selectedSportId as a prop
}: {
    referenceData: Record<string, any[]>;
    leagues: any[];
    onRefresh: () => void;
    selectedSportId: number | null; // NEW: add selectedSportId to props
}) {
    // Guard: referenceData may be undefined on first render
    if (!referenceData) {
        return <div>Loading reference data…</div>;
    }

    // Safe access
    const countries = referenceData["Country"] ?? [];

    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    return (
        <div className="w-full overflow-x-auto p-4">
            <Table>
                <TableCaption>A list of all leagues in the system</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Country</TableHead>
                        {/* ⭐ Add Button moved here */}
                        <TableHead className="text-right">
                            <AddButton 
                                label=" " 
                                onClick={() => setCreating(true)}
                                className="mb-0 py-1 px-3 text-xs inline-flex" 
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creating && (
                        <CreateRow
                            endpoint="/api/v1/league/"
                            idPlaceholder="auto"
                            onCreateSuccess={() => {
                                setCreating(false);
                                onRefresh();
                            }}
                            onCancel={() => setCreating(false)}
                            fields={[
                                { key: "league_name", label: "Name", type: "text" },
                                {
                                    key: "sport_id", label: "Sport", type: "number", editable: false,
                                    defaultValue: selectedSportId ?? undefined, visible: false
                                }, // NEW: set default sport_id
                                { key: "level", label: "Level", type: "number", defaultValue: 1 },
                                {
                                    key: "country_id",
                                    label: "Country",
                                    type: "select",
                                    options: countries.map((c) => ({
                                        id: c.reference_value_id,
                                        label: c.value,
                                    })),
                                },
                            ]}
                        />
                    )}
                    {leagues.map((league) => (
                        <EditableRow
                            key={league.league_id}
                            record={league}
                            idField="league_id"
                            endpoint="/api/v1/league/"
                            onRefresh={onRefresh}
                        >
                            {(data, update, isEditing) => (
                                <>
                                    <TableCell>{league.league_id}</TableCell>
                                    {/* League Name Cell */}
                                    <TableCell>
                                        <EditableCell
                                            isEditing={isEditing}
                                            value={data.league_name}
                                            renderInput={() => (
                                                <Input
                                                    defaultValue={data.league_name}
                                                    onChange={(e) => update("league_name", e.target.value)}
                                                    autoFocus
                                                    className="h-8"
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <EditableCell
                                            isEditing={isEditing}
                                            value={data.level}
                                            renderInput={() => (
                                                <Input
                                                    type="number" step="1" min="1"
                                                    defaultValue={data.level}
                                                    onChange={(e) => update("level", e.target.value)}
                                                    className="h-8"
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            isEditing={isEditing}
                                            value={data.country_id}
                                            renderInput={() => (
                                                <Select
                                                    value={data.country_id ? String(data.country_id) : ""}
                                                    onValueChange={(newValue) => {
                                                        // Call the FastAPI update endpoint
                                                        update("country_id", newValue === "" ? null : Number(newValue));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {countries.map((c) => (
                                                            <SelectItem
                                                                key={c.reference_value_id}
                                                                value={String(c.reference_value_id)}
                                                            >
                                                                {c.value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            // NEW: Use renderDisplay to show the name from the nested object
                                            renderDisplay={() => (
                                                <span>{league.country?.value ?? "N/A"}</span>
                                            )}
                                        />
                                    </TableCell>
                                </>
                            )}
                        </EditableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
