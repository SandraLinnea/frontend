"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth";

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

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/property?limit=50&offset=0", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Kunde inte hämta boenden");
        const data = await res.json();
        setProperties(data.data ?? []);
      } catch {
        setError("Ett fel uppstod när boenden skulle hämtas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="card max-w-2xl">Laddar boenden…</div>;
  if (error) return <div className="card max-w-2xl">{error}</div>;

  return (
    <div className="space-y-6">
      <p className="text-center text-lg font-medium">Välkommen till EastBNB!</p>

      {properties.length === 0 ? (
        <div className="card text-center text-gray-500">
          Inga boenden hittades just nu.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {properties.map((p) => {
            const code = p.property_code ?? p.id!;
            const available = p.availability ?? true;

            return (
              <div key={code} className="card">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-36 object-cover rounded-t-[2rem]"
                  />
                ) : (
                  <div className="w-full h-36 rounded-t-[2rem] bg-gradient-to-br from-gray-200 to-gray-100" />
                )}

                <div className="flex items-start justify-between gap-3 mb-2 mt-2">
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    title={available ? "Tillgänglig" : "Otillgänglig"}
                  >
                    {available ? "Tillgänglig" : "Otillgänglig"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {p.city ?? "-"}, {p.country ?? "-"}
                </p>
                <p className="text-sm font-medium mb-4">
                  {p.price_per_night} kr/natt
                </p>

                {user ? (
                  <Link
                    href={`/properties/${encodeURIComponent(code)}`}
                    className="btn select-none inline-block"
                  >
                    <span className="btn-outer">
                      <span className="btn-inner">
                        <span>Se mer / boka</span>
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`/properties/${encodeURIComponent(code)}`}
                    className="underline text-sm"
                  >
                    Se detaljer
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
