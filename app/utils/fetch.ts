export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`/api${url}`, { credentials: "include" });
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
  const res = await fetch(`/api${url}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}
