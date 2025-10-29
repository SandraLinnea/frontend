"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
  price_per_night: number;
  city?: string; country?: string; description?: string;
};

export default function PropertyDetail() {
  const params = useParams<{ id: string }>();
  const [p, setP] = useState<Property | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/property/${encodeURIComponent(params.id)}`, { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        setP(await res.json());
      } catch {
        setErr("Kunde inte hitta boendet");
      }
    })();
  }, [params.id]);

  if (err) return <p>{err}</p>;
  if (!p) return <p>Laddar…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{p.title}</h1>
      <p className="text-gray-600">{p.city}, {p.country}</p>
      <p>{p.description}</p>
      <p className="font-medium">{p.price_per_night} kr/natt</p>
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
    setLoading(true);
    const res = await fetch("/api/booking", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: propertyKey,
        start_date: start,
        end_date: end,
        guests,
        note,
      }),
    });
    setLoading(false);
    if (res.status === 401) { setMsg("Du måste vara inloggad."); return; }
    if (!res.ok) { setMsg("Bokningen misslyckades."); return; }
    setMsg("Bokning skapad!");
  }

  return (
    <form onSubmit={submit} className="space-y-3 border-t pt-4 max-w-md">
      <h2 className="text-lg font-semibold">Boka</h2>
      <div className="flex flex-col gap-3">
      <label className="block mb-1 font-medium">Från datum</label>
      <input
        type="date"
        className="w-full rounded border px-3 py-2"
        value={start}
        onChange={e => setStart(e.target.value)}
        required
      />
      <label className="block mt-4 mb-1 font-medium">Till datum</label>
      <input
        type="date"
        className="w-full rounded border px-3 py-2"
        value={end}
        onChange={e => setEnd(e.target.value)}
        required
      />
      <label className="block mt-4 mb-1 font-medium">Antal personer</label>
      <input
        type="number"
        min={1}
        className="w-full rounded border px-3 py-2"
        value={guests}
        onChange={e => setGuests(Number(e.target.value))}
        required
      />
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Meddelande (valfritt)"
          value={note}
          onChange={e=>setNote(e.target.value)}
          rows={3}
        />
      </div>

      <button className="rounded bg-black text-white px-4 py-2" disabled={loading}>
        {loading ? "Bokar…" : "Boka"}
      </button>

      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
