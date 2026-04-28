"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { EditableRow } from "@/components/EditableRow";
import { on } from "events";

export function LeaguesTable({ leagues, onRefresh }: { leagues: any[], onRefresh: () => void}) {
    return (
        <div className="w-full overflow-x-auto p-4">
            <Table>
                <TableCaption>A list of all leagues in the system</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Sport ID</TableHead>
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
                                        <Input defaultValue={data.league_name} onChange={(e) => update("league_name", e.target.value)} />
                                    </TableCell>
                                    <TableCell>{league.sport_id}</TableCell>
                                    <TableCell>{league.level}</TableCell>
                                    <TableCell>{league.country.value}</TableCell>
                                </>
                            )}
                        </EditableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
