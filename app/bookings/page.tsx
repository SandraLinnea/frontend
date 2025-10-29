"use client";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  guests?: number;
  status: "pending" | "confirmed" | "cancelled";
  total_price: number;
};

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

  if (loading) return <p>Laddar…</p>;
  if (msg) return <p>{msg}</p>;

  return (
    <>
      <h1 className="text-2xl font-semibold">Mina bokningar</h1>
      <ul className="mt-4 space-y-3">
        {data.map((b) => (
          <li key={b.id} className="border rounded p-3">
            <div><b>Property:</b> {b.property_id}</div>
            <div><b>Datum:</b> {b.start_date} → {b.end_date}</div>
            <div><b>Gäster:</b> {b.guests ?? 1}</div>
            <div><b>Status:</b> {b.status}</div>
            <div><b>Pris:</b> {b.total_price} kr</div>
          </li>
        ))}
      </ul>
    </>
  );
}
