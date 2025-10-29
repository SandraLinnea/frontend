// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState<string|null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/login", {
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { setMsg("Inloggning misslyckades"); return; }
    router.push("/properties");
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h1 className="text-2xl font-semibold">Logga in</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="E-post" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Lösenord" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="rounded bg-black text-white px-4 py-2">Logga in</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
