import { ReferenceValue } from "./referencevalue";

export interface ReferenceCategory {
  description: string | null;
  name: string;
  reference_category_id: number;
  reference_values: ReferenceValue[]; // Or your specific ReferenceValue type
}
