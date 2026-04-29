"use client";

import { Position } from "@/types/position";
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

export function PositionsTable({
    positions,
    onRefresh,
    selectedSportId, // NEW: receive selectedSportId as a prop
}: {
    positions: any[];
    onRefresh: () => void;
    selectedSportId: number | null; // NEW: add selectedSportId to props
}) {
    const [creating, setCreating] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    return (
        <div className="w-full overflow-x-auto p-4">
            <Table>
                <TableCaption>A list of all positions in the system</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Abbreviaton</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">
                            <AddButton
                                label="Position"
                                onClick={() => setCreating(true)}
                                className="mb-0 py-1 px-3 text-xs inline-flex"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creating && (
                        <CreateRow
                            endpoint="/api/v1/position/"
                            idPlaceholder="auto"
                            onCreateSuccess={() => {
                                setCreating(false);
                                onRefresh();
                            }}
                            onCancel={() => setCreating(false)}
                            fields={[
                                { key: "position_name", label: "Name", type: "text" },
                                {
                                    key: "sport_id", label: "Sport", type: "number", editable: false,
                                    defaultValue: selectedSportId ?? undefined, visible: false
                                }, // NEW: set default sport_id
                                { key: "position_abbreviation", label: "Abbreviaton", type: "text" },
                                { key: "description", label: "Description", type: "text" },
                            ]}
                        />
                    )}
                    {positions.map((position) => (
                        <EditableRow
                            key={position.position_id}
                            record={position}
                            idField="position_id"
                            endpoint="/api/v1/position/"
                            onRefresh={onRefresh}
                        >
                            {(data, update, isEditing) => (
                                <>
                                    <TableCell>{position.position_id}</TableCell>
                                    {/* Position Name Cell */}
                                    <TableCell>
                                        <EditableCell
                                            isEditing={isEditing}
                                            value={data.position_name}
                                            renderInput={() => (
                                                <Input
                                                    defaultValue={data.position_name}
                                                    onChange={(e) => update("position_name", e.target.value)}
                                                    autoFocus
                                                    className="h-8"
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            isEditing={isEditing}
                                            value={data.position_abbreviation}
                                            renderInput={() => (
                                                <Input
                                                    defaultValue={data.position_abbreviation}
                                                    onChange={(e) => update("position_abbreviation", e.target.value)}
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
                                                    defaultValue={data.description}
                                                    onChange={(e) => update("description", e.target.value)}
                                                    className="h-8"
                                                />
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
