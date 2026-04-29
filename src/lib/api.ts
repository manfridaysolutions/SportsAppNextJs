export const API_URL = process.env.NEXT_PUBLIC_API_URL;

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