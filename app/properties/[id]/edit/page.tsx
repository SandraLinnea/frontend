"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/utils/fetch";
import type { Property, NewProperty } from "@/types/property";
import { useParams, useRouter } from "next/navigation";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [v, setV] = useState<Partial<NewProperty>>({});
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    apiGet<Property>(`/property/${id}`).then(p => {
      setV({
        title: p.title,
        description: p.description,
        city: p.city,
        country: p.country,
        price_per_night: p.price_per_night,
        availability: p.availability,
      });
    }).catch(e => setMsg((e as Error).message));
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await apiSend<Property, Partial<NewProperty>>(`/property/${id}`, "PUT", v);
      router.push(`/properties/${id}`);
    } catch (e: unknown) {
      setMsg((e as Error).message);
    }
  }

  return (
    <>
      <h1>Redigera boende</h1>
      <form onSubmit={submit} className="space-y-3 max-w-sm">
        <input placeholder="Titel" value={v.title ?? ""} onChange={(e) => setV({ ...v, title: e.target.value })} required />
        <input placeholder="Beskrivning" value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} />
        <input placeholder="Stad" value={v.city ?? ""} onChange={(e) => setV({ ...v, city: e.target.value })} />
        <input placeholder="Land" value={v.country ?? ""} onChange={(e) => setV({ ...v, country: e.target.value })} />
        <input type="number" min={0} placeholder="Pris per natt" value={v.price_per_night ?? 0}
               onChange={(e) => setV({ ...v, price_per_night: Number(e.target.value) })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={Boolean(v.availability)} onChange={(e) => setV({ ...v, availability: e.target.checked })} />
          Tillgänglig
        </label>
        <button type="submit">Spara</button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  );
}
