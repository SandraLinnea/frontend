"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiSend } from "@/utils/fetch";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  price_per_night: number;
  city?: string;
  country?: string;
  description?: string;
};

export default function PropertyDetail() {
  const params = useParams<{ id: string }>();
  const [p, setP] = useState<Property | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Property>(`/property/${encodeURIComponent(params.id)}`);
        setP(data);
      } catch {
        setErr("Kunde inte hitta boendet");
      }
    })();
  }, [params.id]);

  if (err) return <p>{err}</p>;
  if (!p) return <p>Laddar…</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        <p className="text-gray-600">
          {p.city ?? "-"}, {p.country ?? "-"}
        </p>
        {p.description && <p>{p.description}</p>}
        <p className="font-medium">{p.price_per_night} kr/natt</p>
      </div>

      <BookingForm propertyKey={p.property_code ?? p.id!} />
    </div>
  );
}

function BookingForm({ propertyKey }: { propertyKey: string }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (start && end && new Date(start) > new Date(end)) {
      setMsg("Slutdatum måste vara efter startdatum.");
      return;
    }

    setLoading(true);
    try {
      await apiSend("/booking", "POST", {
        property_id: propertyKey,
        start_date: start,
        end_date: end,
        guests,
        note,
      });
      setMsg("Bokning skapad!");
      setStart("");
      setEnd("");
      setGuests(1);
      setNote("");
    } catch {
      setMsg("Du måste vara inloggad för att skapa en bokning.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card max-w-md space-y-5">
      <h2 className="text-lg font-semibold">Boka</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="block mb-2 font-medium">
            Från datum
          </label>
          <input
            id="start"
            type="date"
            className="input"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="end" className="block mb-2 font-medium">
            Till datum
          </label>
          <input
            id="end"
            type="date"
            className="input"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="guests" className="block mb-2 font-medium">
          Antal personer
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          className="input"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="note" className="block mb-2 font-medium">
          Meddelande (valfritt)
        </label>
        <textarea
          id="note"
          className="input"
          placeholder="Meddelande till värden"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <button
        className="btn select-none disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
        type="submit"
      >
        <span className="btn-outer">
          <span className="btn-inner">
            <span>{loading ? "Bokar…" : "Boka"}</span>
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
