/* import { apiUrl } from "@/lib/api";

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
 */

// src/utils/fetch.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3002";

function makeUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(makeUrl(path), {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? `GET ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function apiSend<
  T = unknown,
  B extends object = Record<string, unknown>
>(path: string, method: "POST" | "PUT" | "DELETE", body?: B): Promise<T> {
  const res = await fetch(makeUrl(path), {
    method,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? `${method} ${path} failed (${res.status})`);
  }
  return res.status === 204
    ? (undefined as T)
    : (res.json() as Promise<T>);
}
