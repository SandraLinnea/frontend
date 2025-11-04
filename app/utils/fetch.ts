//beginning of monday

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


// home on monday

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



const fromEnv = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

const isBrowser = typeof window !== "undefined";
const isDevHost =
  isBrowser &&
  (window.location.hostname.includes("localhost") ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "127.1.1");

const devFallbackBase = "http://localhost:3002";

export const API_BASE =
  fromEnv || (isBrowser ? (isDevHost ? devFallbackBase : "") : "");

export function toApiUrl(path: string): string {
  if (!path) return API_BASE || "/";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}
async function readJsonSafe<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : ({} as T)) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = toApiUrl(path);
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `GET ${url} failed (${res.status})`;
    try {
      const j = await res.clone().json();
      if (j && typeof j === "object" && "error" in j) msg = String(j.error);
    } catch {}
    throw new Error(msg);
  }
  return readJsonSafe<T>(res);
}

export async function apiSend<T, B extends Record<string, any>>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: B,
  init?: RequestInit
): Promise<T> {
  const url = toApiUrl(path);
  const res = await fetch(url, {
    method,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (!res.ok) {
    let msg = `${method} ${url} failed (${res.status})`;
    try {
      const j = await res.clone().json();
      if (j && typeof j === "object" && "error" in j) msg = String(j.error);
    } catch {}
    throw new Error(msg);
  }
  return readJsonSafe<T>(res);
}

export async function backendFetch<
  BodyT extends Record<string, any>,
  ResDataT = unknown
>(path: string, init?: RequestInit, body?: BodyT) {
  const url = toApiUrl(path);

  const reqInit: RequestInit = {
    credentials: "include",
    cache: "no-store",
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  };

  if (body) reqInit.body = JSON.stringify(body);

  const res = await fetch(url, reqInit);
  const text = await res.text();

  let data:
    | { message: string; status?: number; data?: ResDataT; token?: string }
    | any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`Failed parsing JSON [${url}]`, text);
    data = { message: text };
  }

  return {
  res,
  data: data as { message?: string; status?: number; data?: ResDataT; token?: string }
};
}

