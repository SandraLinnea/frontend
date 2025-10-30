"use client";
import { useState, useMemo } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () => !name || !email || !password || password.length < 8 || loading,
    [name, email, password, loading]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        setMsg("Registrering misslyckades");
        return;
      }
      setMsg("Konto skapat! Kolla din e-post (om e-postverifiering är på).");
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMsg("Nätverksfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Skapa konto</h1>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Namn
        </label>
        <input
          id="name"
          className="input"
          placeholder="Namn"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          E-post
        </label>
        <input
          id="email"
          type="email"
          className="input"
          placeholder="namn@exempel.se"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Lösenord (min 8 tecken)
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="btn select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="btn-outer">
          <span className="btn-inner">
            <span>{loading ? "Skapar konto…" : "Skapa"}</span>
          </span>
        </span>
      </button>

      {msg && (
        <p className="text-sm" role="alert" aria-live="polite">
          {msg}
        </p>
      )}
    </form>
  );
}
