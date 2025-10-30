"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function PropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/property?limit=50&offset=0", {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Kunde inte hämta boenden");
        setData(json.data ?? []);
      } catch (err) {
        setError("Ett fel uppstod när boenden skulle hämtas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="card max-w-2xl">Laddar boenden…</div>;
  if (error) return <div className="card max-w-2xl">{error}</div>;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Boenden</h1>
        <Link href="/properties/new" className="btn select-none inline-block">
          <span className="btn-outer">
            <span className="btn-inner">
              <span>+ Skapa nytt</span>
            </span>
          </span>
        </Link>
      </div>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((p) => {
          const id = p.property_code ?? p.id ?? "";
          const available = p.availability ?? true;

          return (
            <li key={id} className="card p-0 overflow-hidden">
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
                    href={`/properties/${encodeURIComponent(id)}`}
                    className="underline"
                  >
                    Se detaljer
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.length === 0 && (
        <div className="card text-gray-500 text-center mt-6">
          Inga boenden hittades just nu.
        </div>
      )}
    </>
  );
}
