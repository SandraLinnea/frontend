"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiSend } from "@/utils/fetch";
import type { Booking } from "@/types/booking";

type FormState = {
  start_date: string;
  end_date: string;
  guests: number;
  note: string;
};

export default function EditBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [v, setV] = useState<FormState>({
    start_date: "",
    end_date: "",
    guests: 1,
    note: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const list = await apiGet<Booking[]>("/booking");
        const b = list.find((x) => x.id === id);
        if (!b) {
          setMsg("Kunde inte hitta bokningen");
          return;
        }
        setV({
          start_date: b.start_date.slice(0, 10),
          end_date: b.end_date.slice(0, 10),
          guests: b.guests ?? 1,
          note: b.note ?? "",
        });
      } catch (e) {
        setMsg((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const disabled = useMemo(() => {
    if (!v.start_date || !v.end_date) return true;
    try {
      return new Date(v.end_date) <= new Date(v.start_date);
    } catch {
      return true;
    }
  }, [v.start_date, v.end_date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await apiSend(`/booking/${encodeURIComponent(id)}`, "PUT", {
        start_date: v.start_date,
        end_date: v.end_date,
        guests: v.guests,
        note: v.note || undefined,
      });
      router.push("/bookings");
    } catch (e) {
      setMsg((e as Error).message || "Kunde inte spara");
    }
  }

  if (loading) return <div className="card max-w-md">Laddar…</div>;
  if (msg) return <div className="card max-w-md">{msg}</div>;

  return (
    <form onSubmit={submit} className="card max-w-md space-y-5">
      <h1 className="text-xl font-semibold">Redigera bokning</h1>

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
          value={v.guests}
          onChange={(e) => setV({ ...v, guests: Number(e.target.value) })}
        />
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium mb-2">
          Meddelande
        </label>
        <textarea
          id="note"
          className="input"
          rows={3}
          placeholder="Meddelande till värden"
          value={v.note}
          onChange={(e) => setV({ ...v, note: e.target.value })}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="btn select-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="btn-outer">
            <span className="btn-inner">
              <span>Spara</span>
            </span>
          </span>
        </button>

        <button
          type="button"
          className="btn select-none"
          onClick={() => router.back()}
        >
          <span className="btn-outer">
            <span className="btn-inner">
              <span>Avbryt</span>
            </span>
          </span>
        </button>
      </div>

      {disabled && (
        <p className="text-sm text-red-600">
          Slutdatum måste vara efter startdatum.
        </p>
      )}
    </form>
  );
}
