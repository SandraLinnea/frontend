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
      <p>{p.city}, {p.country}</p>
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
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
    if (res.status === 401) { setMsg("Du måste vara inloggad."); return; }
    if (!res.ok) { setMsg("Bokningen misslyckades."); return; }
    setMsg("Bokning skapad!");
  }

  return (
    <form onSubmit={submit} className="space-y-2 border-t pt-4">
      <h2 className="text-lg font-semibold">Boka</h2>
      <div className="flex gap-3">
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="rounded border px-3 py-2"/>
        <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="rounded border px-3 py-2"/>
        <input type="number" min={1} value={guests} onChange={e=>setGuests(Number(e.target.value))} className="w-20 rounded border px-3 py-2"/>
      </div>
      <textarea placeholder="Meddelande" value={note} onChange={e=>setNote(e.target.value)} className="w-full rounded border px-3 py-2"/>
      <button className="rounded bg-black text-white px-4 py-2">Boka</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
