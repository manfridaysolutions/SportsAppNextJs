export interface FieldDef {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "boolean" | "date" | "multi-select" | "link";
    linkOptions?: {
        baseUrl: string;
        params: Record<string, string>; // { "url_param_name": "data_property_name" }
        target?: "_blank" | "_self";
        displayText?: string; // NEW: Allows static text override
    };
    render?: (value: any, record: any) => React.ReactNode;
    options?: { id: number | string; label: string }[];
    defaultValue?: any;
    editable?: boolean;
    visible?: boolean;
    searchable?: boolean;
}