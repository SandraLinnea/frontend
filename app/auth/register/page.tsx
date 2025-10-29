"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email,setEmail] = useState(""); 
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState<string|null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/register", {
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) { setMsg("Registrering misslyckades"); return; }
    setMsg("Konto skapat! Kolla din e-post (om e-postverifiering är på).");
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h1 className="text-2xl font-semibold">Skapa konto</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Namn" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="E-post" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Lösenord (min 8 tecken)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="rounded bg-black text-white px-4 py-2">Skapa</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
