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



function toApiPath(path: string): string {
  if (path.startsWith("http")) return path;

  return path.startsWith("/api/")
    ? path
    : `/api${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = toApiPath(path);
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as Record<string, unknown>));
    throw new Error(j && typeof j === "object" && "error" in j ? String((j as { error?: unknown }).error) : `GET ${url} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function apiSend<T, B extends object>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: B
): Promise<T> {
  const url = toApiPath(path);
  const res = await fetch(url, {
    method,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({} as Record<string, unknown>));
    throw new Error(j && typeof j === "object" && "error" in j ? String((j as { error?: unknown }).error) : `${method} ${url} failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

