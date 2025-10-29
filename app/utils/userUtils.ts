import type { NewUser, User } from "../types/user";

const base = "/api";

export async function createUser(
  input: Partial<NewUser>
): Promise<User> {
  const res = await fetch(`${base}/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Create user failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<User>;
}
