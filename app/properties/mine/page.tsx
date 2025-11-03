/* "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  city?: string;
  country?: string;
  price_per_night: number;
  availability?: boolean;
  image_url?: string;
};

type SortKey = "title" | "price";
type SortDir = "asc" | "desc";

export default function MyPropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`/api/property?limit=100&offset=0&mine=1`, {
          credentials: "include",
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error ?? "Kunde inte hämta");
        setData(j.data ?? []);
      } catch {
        setMsg("Kunde inte hämta dina boenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSorted = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    let list = data.filter((p) => {
      const matchQ =
        !qNorm ||
        p.title.toLowerCase().includes(qNorm) ||
        (p.city ?? "").toLowerCase().includes(qNorm) ||
        (p.country ?? "").toLowerCase().includes(qNorm);
      const matchCity =
        !city || (p.city ?? "").toLowerCase() === city.toLowerCase();
      return matchQ && matchCity;
    });

    list.sort((a, b) => {
      let res = 0;
      if (sortKey === "title") res = a.title.localeCompare(b.title);
      else res = (a.price_per_night ?? 0) - (b.price_per_night ?? 0);
      return sortDir === "asc" ? res : -res;
    });

    return list;
  }, [data, q, city, sortKey, sortDir]);

  async function handleDelete(code: string) {
    if (!confirm("Vill du radera detta boende?")) return;
    const res = await apiFetch(`/api/property/${encodeURIComponent(code)}`, {
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

  if (loading) return <div className="card max-w-2xl">Laddar…</div>;
  if (msg) return <div className="card max-w-2xl">{msg}</div>;

  const cities = Array.from(
    new Set(data.map((d) => (d.city ?? "").trim()).filter(Boolean))
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">Mina properties</h1>
      <div className="my-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sök</label>
          <input
            className="input"
            placeholder="Sök titel, stad eller land"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stad</label>
          <select
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Alla</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sortera på</label>
          <select
            className="input"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="title">Titel (A–Ö)</option>
            <option value="price">Pris</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Riktning</label>
          <select
            className="input"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
          >
            <option value="asc">Stigande</option>
            <option value="desc">Fallande</option>
          </select>
        </div>

        <div className="ml-auto">
          <Link href="/properties/new" className="btn select-none inline-block">
            <span className="btn-outer">
              <span className="btn-inner">
                <span>+ Skapa nytt</span>
              </span>
            </span>
          </Link>
        </div>
      </div>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredSorted.map((p) => {
          const code = p.property_code ?? p.id!;
          const available = p.availability ?? true;
          return (
            <li key={code} className="card p-0 overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-t-[2rem]"
                />
              ) : (
                <div className="w-full h-40 rounded-t-[2rem] bg-gradient-to-br from-gray-200 to-gray-100" />
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-semibold">{p.title}</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {available ? "Tillgänglig" : "Otillgänglig"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {p.city ?? "-"}, {p.country ?? "-"} — {p.price_per_night} kr/natt
                </div>

                <div className="mt-3 flex gap-3 text-sm">
                  <Link
                    href={`/properties/${encodeURIComponent(code)}`}
                    className="underline"
                  >
                    Visa
                  </Link>
                  <Link
                    href={`/properties/${encodeURIComponent(code)}/edit`}
                    className="underline"
                  >
                    Redigera
                  </Link>
                  <button
                    onClick={() => handleDelete(code)}
                    className="underline text-red-600"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {filteredSorted.length === 0 && (
          <li className="card text-gray-500 sm:col-span-2 md:col-span-3 lg:col-span-4">
            Inga träffar…
          </li>
        )}
      </ul>
    </>
  );
}
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiGet, apiSend } from "@/utils/fetch"; // ⬅️ ändrad import

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  city?: string;
  country?: string;
  price_per_night: number;
  availability?: boolean;
  image_url?: string;
};

type SortKey = "title" | "price";
type SortDir = "asc" | "desc";

export default function MyPropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    (async () => {
      try {
        // ⬇️ apiFetch("/api/property...") → apiGet("/property...")
        const j = await apiGet<{ data: Property[]; error?: string }>(
          `/property?limit=100&offset=0&mine=1`
        );
        setData(j.data ?? []);
      } catch {
        setMsg("Kunde inte hämta dina boenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSorted = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    let list = data.filter((p) => {
      const matchQ =
        !qNorm ||
        p.title.toLowerCase().includes(qNorm) ||
        (p.city ?? "").toLowerCase().includes(qNorm) ||
        (p.country ?? "").toLowerCase().includes(qNorm);
      const matchCity =
        !city || (p.city ?? "").toLowerCase() === city.toLowerCase();
      return matchQ && matchCity;
    });

    list.sort((a, b) => {
      let res = 0;
      if (sortKey === "title") res = a.title.localeCompare(b.title);
      else res = (a.price_per_night ?? 0) - (b.price_per_night ?? 0);
      return sortDir === "asc" ? res : -res;
    });

    return list;
  }, [data, q, city, sortKey, sortDir]);

  async function handleDelete(code: string) {
    if (!confirm("Vill du radera detta boende?")) return;
    try {
      // ⬇️ apiFetch(DELETE "/api/property/...") → apiSend("/property/...", "DELETE")
      await apiSend(`/property/${encodeURIComponent(code)}`, "DELETE");
      setData((d) => d.filter((p) => (p.property_code ?? p.id) !== code));
    } catch {
      alert("Radering misslyckades");
    }
  }

  if (loading) return <div className="card max-w-2xl">Laddar…</div>;
  if (msg) return <div className="card max-w-2xl">{msg}</div>;

  const cities = Array.from(
    new Set(data.map((d) => (d.city ?? "").trim()).filter(Boolean))
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">Mina properties</h1>
      <div className="my-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sök</label>
          <input
            className="input"
            placeholder="Sök titel, stad eller land"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stad</label>
          <select
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Alla</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sortera på</label>
          <select
            className="input"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="title">Titel (A–Ö)</option>
            <option value="price">Pris</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Riktning</label>
          <select
            className="input"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
          >
            <option value="asc">Stigande</option>
            <option value="desc">Fallande</option>
          </select>
        </div>

        <div className="ml-auto">
          <Link href="/properties/new" className="btn select-none inline-block">
            <span className="btn-outer">
              <span className="btn-inner">
                <span>+ Skapa nytt</span>
              </span>
            </span>
          </Link>
        </div>
      </div>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredSorted.map((p) => {
          const code = p.property_code ?? p.id!;
          const available = p.availability ?? true;
          return (
            <li key={code} className="card p-0 overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-t-[2rem]"
                />
              ) : (
                <div className="w-full h-40 rounded-t-[2rem] bg-gradient-to-br from-gray-200 to-gray-100" />
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-semibold">{p.title}</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {available ? "Tillgänglig" : "Otillgänglig"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {p.city ?? "-"}, {p.country ?? "-"} — {p.price_per_night} kr/natt
                </div>

                <div className="mt-3 flex gap-3 text-sm">
                  <Link
                    href={`/properties/${encodeURIComponent(code)}`}
                    className="underline"
                  >
                    Visa
                  </Link>
                  <Link
                    href={`/properties/${encodeURIComponent(code)}/edit`}
                    className="underline"
                  >
                    Redigera
                  </Link>
                  <button
                    onClick={() => handleDelete(code)}
                    className="underline text-red-600"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {filteredSorted.length === 0 && (
          <li className="card text-gray-500 sm:col-span-2 md:col-span-3 lg:col-span-4">
            Inga träffar…
          </li>
        )}
      </ul>
    </>
  );
}

