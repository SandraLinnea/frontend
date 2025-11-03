"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiGet, apiSend } from "../../utils/fetch";
import type { Booking, NewBooking } from "../../types/booking";
import type { Property } from "../../types/property";

function NewBookingInner() {
  const [props, setProps] = useState<Property[]>([]);
  const [v, setV] = useState<NewBooking>({
    property_id: "",
    start_date: "",
    end_date: "",
    guests: 1,
    note: "",
  });
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    apiGet<{ data: Property[] }>("/property?limit=100&offset=0")
      .then((r) => setProps(r.data))
      .catch((e) => setMsg((e as Error).message));

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
      <h1 className="text-2xl font-semibold mb-4">Ny bokning</h1>

      <form onSubmit={submit} className="card max-w-sm space-y-5">
        <div>
          <label htmlFor="property" className="block text-sm font-medium mb-2">
            Boende
          </label>
          <select
            id="property"
            className="input"
            value={v.property_id}
            onChange={(e) => setV({ ...v, property_id: e.target.value })}
            required
          >
            <option value="">Välj boende</option>
            {props.map((p) => {
              const id = p.property_code ?? p.id ?? "";
              return (
                <option key={id} value={id}>
                  {p.title} — {p.price_per_night} kr
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium mb-2">
              Startdatum
            </label>
            <input
              id="start"
              type="date"
              className="input"
              value={v.start_date}
              onChange={(e) => setV({ ...v, start_date: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="end" className="block text-sm font-medium mb-2">
              Slutdatum
            </label>
            <input
              id="end"
              type="date"
              className="input"
              value={v.end_date}
              onChange={(e) => setV({ ...v, end_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium mb-2">
            Gäster
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            className="input"
            value={v.guests ?? 1}
            onChange={(e) => setV({ ...v, guests: Number(e.target.value) })}
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium mb-2">
            Meddelande
          </label>
          <input
            id="note"
            placeholder="Meddelande till värden"
            className="input"
            value={v.note ?? ""}
            onChange={(e) => setV({ ...v, note: e.target.value })}
          />
        </div>

        <button type="submit" className="btn select-none">
          <span className="btn-outer">
            <span className="btn-inner">
              <span>Boka</span>
            </span>
          </span>
        </button>
      </form>

      {msg && (
        <p className="mt-3 text-sm" role="alert" aria-live="polite">
          {msg}
        </p>
      )}
    </>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="card max-w-sm">Laddar…</div>}>
      <NewBookingInner />
    </Suspense>
  );
}
