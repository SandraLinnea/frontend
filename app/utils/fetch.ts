

/* function toApiPath(path: string): string {
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

 */



const ENV_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

const DEV_BASE = "http://localhost:3002";

export function toApiUrl(path: string): string {
  const base =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? DEV_BASE
      : ENV_BASE;

  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

async function readJsonSafe<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? (JSON.parse(text) as unknown as T) : ({} as T));
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = toApiUrl(path);
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    const errMsg = await extractErrorMessage(res, `GET ${url} failed`);
    throw new ApiError(errMsg, res.status, url);
  }
  return readJsonSafe<T>(res);
}

export async function apiSend<T, B extends Record<string, unknown>>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: B
): Promise<T> {
  const url = toApiUrl(path);
  const res = await fetch(url, {
    method,
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errMsg = await extractErrorMessage(res, `${method} ${url} failed`);
    throw new ApiError(errMsg, res.status, url);
  }
  return readJsonSafe<T>(res);
}

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.clone().json()) as { error?: unknown; message?: unknown };
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;
  } catch {
  }
  return fallback;
}