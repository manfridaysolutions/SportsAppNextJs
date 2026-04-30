"use client";

import { useLeagues } from "@/hooks/useLeagues";
import { BaseDataTable } from "../organisms/BaseDataTable";
import { TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { EditableCell } from "../organisms/EditableCell";

export function LeaguesTable({ referenceData, selectedSportId }: {
    referenceData: Record<string, any[]>;
    selectedSportId: number | null;
}) {
    const { data: leagues = [], refetch, isLoading } = useLeagues(selectedSportId);
    
    const filteredRefData = referenceData && referenceData["Country"]
        ? { Country: referenceData["Country"] } 
        : undefined;

    // const filteredRefData: Record<string, any[]> = referenceData?.["Country"] 
    //     ? { Country: referenceData["Country"] } 
    //     : {};

    const countries = referenceData?.["Country"] ?? [];

    return (
        <BaseDataTable
            title="Leagues"
            caption="A list of all leagues in the system"
            items={leagues}
            isLoading={isLoading}
            idField="league_id"
            idPlaceholder="hide"
            endpoint="/api/v1/league/"
            onRefresh={refetch}
            referenceData={filteredRefData}
            addLabel="League"
            headers={["Name", "Level", "Country"]}
            createFields={[
                { key: "league_name", label: "Name", type: "text" },
                { key: "sport_id", label: "Sport", type: "number", visible: false, defaultValue: selectedSportId },
                { key: "level", label: "Level", type: "number", defaultValue: 1 },
                {
                    key: "country_id",
                    label: "Country",
                    type: "select",
                    options: countries.map((c) => ({ id: c.reference_value_id, label: c.value })),
                },
            ]}
        >
            {(data, update, isEditing, refData) => {
                const rowCountries = refData["Country"] ?? [];
                return (
                    <>
                        <TableCell>
                            <EditableCell
                                isEditing={isEditing}
                                value={data.league_name}
                                renderInput={() => (
                                    <Input
                                        defaultValue={data.league_name}
                                        onChange={(e) => update("league_name", e.target.value)}
                                        className="h-8"
                                    />
                                )}
                            />
                        </TableCell>
                        <TableCell>
                            <EditableCell
                                isEditing={isEditing}
                                value={data.level}
                                renderInput={() => (
                                    <Input
                                        type="number"
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
                                        onValueChange={(val) => update("country_id", val === "" ? null : Number(val))}
                                    >
                                        <SelectTrigger className="w-full h-8">
                                            <SelectValue placeholder="Select country">
                                                {rowCountries.find(c => String(c.reference_value_id) === String(data.country_id))?.value}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rowCountries.map((c) => (
                                                <SelectItem key={c.reference_value_id} value={String(c.reference_value_id)}>
                                                    {c.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                renderDisplay={() => <span>{data.country?.value ?? "N/A"}</span>}
                            />
                        </TableCell>
                    </>
                );
            }}
        </BaseDataTable>
    );
}