export interface Identifiable {
    [key: string]: any; // Allow for various field names, but require at least one unique identifier
}