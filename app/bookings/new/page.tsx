"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "../../utils/fetch";
import type { Booking, NewBooking } from "../../types/booking";
import type { Property } from "../../types/property";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewBookingPage() {
  const [props, setProps] = useState<Property[]>([]);
  const [v, setV] = useState<NewBooking>({ property_id: "", start_date: "", end_date: "", guests: 1, note: "" });
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    apiGet<{ data: Property[] }>("/property?limit=100&offset=0")
      .then(r => setProps(r.data))
      .catch(e => setMsg((e as Error).message));

    const pre = sp.get("property");
    if (pre) setV((old) => ({ ...old, property_id: pre }));
  }, [sp]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await apiSend<Booking, NewBooking>("/booking", "POST", v);
      router.push("/bookings");
    } catch (e: unknown) {
      setMsg((e as Error).message);
    }
  }

  return (
    <>
      <h1>Ny bokning</h1>
      <form onSubmit={submit} className="space-y-3 max-w-sm">
        <select value={v.property_id} onChange={(e) => setV({ ...v, property_id: e.target.value })} required>
          <option value="">Välj boende</option>
          {props.map(p => {
            const id = p.property_code ?? p.id ?? "";
            return <option key={id} value={id}>{p.title} — {p.price_per_night} kr</option>;
          })}
        </select>

        <input type="date" value={v.start_date} onChange={(e) => setV({ ...v, start_date: e.target.value })} required />
        <input type="date" value={v.end_date} onChange={(e) => setV({ ...v, end_date: e.target.value })} required />
        <input type="number" min={1} value={v.guests ?? 1} onChange={(e) => setV({ ...v, guests: Number(e.target.value) })} />
        <input placeholder="Meddelande" value={v.note ?? ""} onChange={(e) => setV({ ...v, note: e.target.value })} />

        <button type="submit">Boka</button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  );
}
