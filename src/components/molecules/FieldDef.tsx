export interface FieldDef {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "boolean" | "date"; 
    options?: { id: number | string; label: string }[];
    defaultValue?: any;
    editable?: boolean;
    visible?: boolean;
    searchable?: boolean;
}