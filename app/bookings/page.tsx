"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  guests?: number;
  status: "pending" | "confirmed" | "cancelled";
  total_price: number;
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function BookingsPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/booking", { credentials: "include" });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.error ?? "Kunde inte hämta bokningar");
        setData(Array.isArray(j) ? j : j.data ?? []);
      } catch (e) {
        setMsg((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasData = useMemo(() => data && data.length > 0, [data]);

  if (loading) {
    return (
      <div className="card max-w-2xl">
        <p>Laddar…</p>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="card max-w-2xl">
        <p role="alert" aria-live="polite">{msg}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Mina bokningar</h1>

      {!hasData ? (
        <div className="card max-w-2xl space-y-4">
          <p>Du har inga bokningar ännu.</p>
          <a href="/properties" className="inline-block btn select-none">
            <span className="btn-outer">
              <span className="btn-inner">
                <span>Utforska boenden</span>
              </span>
            </span>
          </a>
        </div>
      ) : (
        <ul className="space-y-4 max-w-3xl">
          {data.map((b) => {
            const badge =
              b.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : b.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800";
            return (
              <li key={b.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Boende</div>
                    <div className="font-medium">{b.property_id}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${badge}`}
                    aria-label={`Status: ${b.status}`}
                    title={b.status}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Datum</div>
                    <div>
                      {formatDate(b.start_date)} &rarr; {formatDate(b.end_date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Gäster</div>
                    <div>{b.guests ?? 1}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pris</div>
                    <div className="font-medium">{b.total_price} kr</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
