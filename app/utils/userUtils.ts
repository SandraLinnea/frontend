import type { NewUser, User } from "@/types/user";
const base = "/api";

export async function createUser(input: Partial<NewUser>): Promise<User> {
  const res = await fetch(`${base}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Create user failed: ${res.status} ${res.statusText} ${text}`);
  }
  const j = await res.json().catch(() => ({}));
  return {
    id: j?.user?.id ?? "",
    name: input.name ?? null,
    email: j?.user?.email ?? input.email ?? null,
    is_admin: false,
  };
}
