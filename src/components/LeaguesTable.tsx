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
} from "@/components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EditableRow } from "@/components/EditableRow";

export function LeaguesTable({
    referenceData,
    leagues,
    onRefresh,
}: {
    referenceData: Record<string, any[]>;
    leagues: any[];
    onRefresh: () => void;
}) {
    // Guard: referenceData may be undefined on first render
    if (!referenceData) {
        return <div>Loading reference data…</div>;
    }

    // Safe access
    const countries = referenceData["Country"] ?? [];

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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leagues.map((league) => (
                        <EditableRow key={league.league_id}
                            record={league}
                            idField="league_id"
                            endpoint="/api/v1/league/"
                            onRefresh={onRefresh}
                        >
                            {(data, update) => (
                                <>
                                    <TableCell>{league.league_id}</TableCell>
                                    <TableCell>
                                        <Input 
                                            defaultValue={data.league_name} 
                                            onChange={(e) => update("league_name", e.target.value)} 
                                        />
                                    </TableCell>
                                    <TableCell className="w-[100px]">
                                        <Input 
                                            type="number" step="1" min="1"
                                            defaultValue={data.level}
                                            onChange={(e) => update("level", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={String(data.country_id ?? "")}
                                            onValueChange={(newValue) => {
                                                // This is where you call your FastAPI update endpoint
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
