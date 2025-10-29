/* "use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-6">
      <p>Välkommen till EastBNB!</p>

      {!loading && (
        <div className="space-x-4">
          <Link href="/properties">Utforska boenden</Link>

          {user ? (
            <>
              <Link href="/properties/mine">Mina properties</Link>
              <Link href="/bookings">Mina bokningar</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">Logga in</Link>
              <Link href="/auth/register">Skapa konto</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
} */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  city?: string;
  country?: string;
  price_per_night: number;
  availability?: boolean;
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
      } catch (err) {
        console.error(err);
        setError("Ett fel uppstod när boenden skulle hämtas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Laddar boenden…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6">
      <p className="text-center text-lg font-medium">
        Välkommen till EastBNB!
      </p>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">
          Inga boenden hittades just nu.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {properties.map((p) => {
            const code = p.property_code ?? p.id!;
            return (
              <div
                key={code}
                className="rounded border p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {p.city ?? "-"}, {p.country ?? "-"}
                </p>
                <p className="text-sm font-medium mb-2">
                  {p.price_per_night} kr/natt
                </p>
                {user ? (
                  <Link
                    href={`/properties/${encodeURIComponent(code)}`}
                    className="rounded bg-black text-white px-3 py-2 text-sm inline-block"
                  >
                    Se mer / boka
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
