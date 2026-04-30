import { ReferenceCategory } from "./referencecategory";

export interface ReferenceValue {
  description: string | null;
  metadata_field: string | null;
  reference_value_id: number;
  value: string;
  reference_category_id: number;
  sort_order: number;
  reference_category: ReferenceCategory
}
