export interface ReferenceValue {
  description: string | null;
  metadata_field: string | null;
  reference_value_id: number;
  value: string;
  reference_category_id: number;
  sort_order: number;
}

export async function fetchReferenceValues(names: string[]) {
  const params = new URLSearchParams();
  names.forEach(n => params.append("names", n));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reference-categories/by-names/?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reference values");
  }

  return res.json() as Promise<Record<string, ReferenceValue[]>>;
}