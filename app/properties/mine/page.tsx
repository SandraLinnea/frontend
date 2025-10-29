"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  city?: string;
  country?: string;
  price_per_night: number;
};

type SortKey = "title" | "price";
type SortDir = "asc" | "desc";

export default function MyPropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // UI state för filtrering/sortering
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    (async () => {
      try {
        // Backend kan (och bör) RLS-filtrera på owner_id=auth.uid().
        const res = await fetch(`/api/property?limit=100&offset=0`, { credentials: "include" });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error ?? "Kunde inte hämta");
        setData(j.data ?? []);
      } catch (e) {
        setMsg("Kunde inte hämta dina boenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Klientside: filtrering + sortering
  const filteredSorted = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    let list = data.filter(p => {
      const matchQ =
        !qNorm ||
        p.title.toLowerCase().includes(qNorm) ||
        (p.city ?? "").toLowerCase().includes(qNorm) ||
        (p.country ?? "").toLowerCase().includes(qNorm);
      const matchCity = !city || (p.city ?? "").toLowerCase() === city.toLowerCase();
      return matchQ && matchCity;
    });

    list.sort((a, b) => {
      let res = 0;
      if (sortKey === "title") {
        res = a.title.localeCompare(b.title);
      } else if (sortKey === "price") {
        res = (a.price_per_night ?? 0) - (b.price_per_night ?? 0);
      }
      return sortDir === "asc" ? res : -res;
    });

    return list;
  }, [data, q, city, sortKey, sortDir]);

  async function handleDelete(code: string) {
    if (!confirm("Vill du radera detta boende?")) return;
    const res = await fetch(`/api/property/${encodeURIComponent(code)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? "Radering misslyckades");
      return;
    }
    setData((d) => d.filter((p) => (p.property_code ?? p.id) !== code));
  }

  if (loading) return <p>Laddar…</p>;
  if (msg) return <p>{msg}</p>;

  // unika stadsnamn för enkel filterdropdown
  const cities = Array.from(
    new Set(data.map(d => (d.city ?? "").trim()).filter(Boolean))
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">Mina properties</h1>

      <div className="my-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Sök</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Sök titel, stad eller land"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stad</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Alla</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sortera på</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="title">Titel (A–Ö)</option>
            <option value="price">Pris</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Riktning</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
          >
            <option value="asc">Stigande</option>
            <option value="desc">Fallande</option>
          </select>
        </div>

        <div className="ml-auto">
          <Link className="rounded bg-black text-white px-4 py-2 inline-block" href="/properties/new">
            + Skapa nytt
          </Link>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {filteredSorted.map((p) => {
          const code = p.property_code ?? p.id!;
          return (
            <li key={code} className="border rounded p-3">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">
                {p.city ?? "-"}, {p.country ?? "-"} — {p.price_per_night} kr/natt
              </div>
              <div className="mt-2 flex gap-3">
                <Link href={`/properties/${encodeURIComponent(code)}`} className="underline">
                  Visa
                </Link>
                <Link href={`/properties/${encodeURIComponent(code)}/edit`} className="underline">
                  Redigera
                </Link>
                <button onClick={() => handleDelete(code)} className="text-red-600 underline">
                  Radera
                </button>
              </div>
            </li>
          );
        })}
        {filteredSorted.length === 0 && <li className="text-gray-500">Inga träffar…</li>}
      </ul>
    </>
  );
}
