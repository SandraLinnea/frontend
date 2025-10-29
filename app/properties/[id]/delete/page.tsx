"use client";

import { useEffect, useState } from "react";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  city?: string;
  country?: string;
  price_per_night: number;
};

export default function PropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/property?limit=50&offset=0`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
        const j = await res.json();
        setData(j.data ?? []);
      } catch (e) {
        setErr("Kunde inte hämta boenden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Laddar…</p>;
  if (err) return <p>{err}</p>;

  return (
    <div>
      <h1>Boenden</h1>
      <ul>
        {data.map((p) => {
          const code = p.property_code ?? p.id!;
          return (
            <li key={code}>
              <a href={`/properties/${encodeURIComponent(code)}`}>{p.title}</a>{" "}
              – {p.city ?? "-"}, {p.country ?? "-"} – {p.price_per_night} kr/natt
            </li>
          );
        })}
      </ul>
    </div>
  );
}
