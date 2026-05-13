import { ReferenceCategory } from "@/types/referencecategory";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = "/api/v1";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status}`);
  }

  return res.json();
}

// Function to handle POST/PUT requests
export async function apiSave<T>(path: string, method: "POST" | "PUT", data: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`API DELETE ${path} failed: ${res.status}`);
  }
}


export async function fetchReferenceValues(names: string[]): Promise<ReferenceCategory[]> {
  const params = new URLSearchParams();
  names.forEach(n => params.append("names", n));

  const res = await fetch(
    `${API_URL}/api/v1/reference-categories/by-names/?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reference values");
  }

  // Return it as the array it actually is
  return res.json(); 
}