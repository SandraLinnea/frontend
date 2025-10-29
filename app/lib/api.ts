const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function apiUrl(path: string) {
  if (typeof window === "undefined") {
    return new URL(path, APP_ORIGIN).toString();
  }
  return path;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
}
