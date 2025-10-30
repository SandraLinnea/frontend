"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setMsg("Inloggning misslyckades");
        return;
      }
      router.push("/properties");
    } catch {
      setMsg("Nätverksfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Logga in</h1>

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
          Lösenord
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="btn-outer">
          <span className="btn-inner">
            <span>{loading ? "Loggar in…" : "Logga in"}</span>
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
