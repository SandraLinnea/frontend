import { apiUrl } from "@/lib/api";

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(apiUrl(`/api${url}`), { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function apiSend<T, B extends object>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: B
): Promise<T> {
  const res = await fetch(apiUrl(`/api${url}`), {
    method,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}
