"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/utils/fetch";
import type { Property, NewProperty } from "@/types/property";
import { useParams, useRouter } from "next/navigation";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [v, setV] = useState<Partial<NewProperty>>({
    title: "",
    description: "",
    city: "",
    country: "",
    price_per_night: 0,
    availability: true,
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const p = await apiGet<Property>(`/property/${id}`);
        setV({
          title: p.title,
          description: p.description ?? "",
          city: p.city ?? "",
          country: p.country ?? "",
          price_per_night: p.price_per_night,
          availability: p.availability ?? true,
          image_url: (p as any).image_url ?? "",
        });
      } catch (e) {
        setMsg((e as Error).message || "Kunde inte hämta boendet");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await apiSend<Property, Partial<NewProperty>>(`/property/${id}`, "PUT", v);
      router.push(`/properties/${id}`);
    } catch (e) {
      setMsg((e as Error).message || "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="card max-w-xl">Laddar…</div>;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Redigera boende</h1>

      <form onSubmit={submit} className="card max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Titel</label>
          <input
            className="input"
            required
            value={v.title ?? ""}
            onChange={(e) => setV({ ...v, title: e.target.value })}
            placeholder="Ex: Röd stuga vid sjön"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Beskrivning</label>
          <textarea
            className="input"
            rows={4}
            value={v.description ?? ""}
            onChange={(e) => setV({ ...v, description: e.target.value })}
            placeholder="Kort beskrivning av boendet…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bildlänk (URL)</label>
          <input
            className="input"
            inputMode="url"
            placeholder="https://exempel.se/bild.jpg"
            value={v.image_url ?? ""}
            onChange={(e) => setV({ ...v, image_url: e.target.value })}
          />
          {!!v.image_url && (
            <div className="mt-3 rounded-2xl overflow-hidden border">
              <img
                src={v.image_url}
                alt="Förhandsvisning"
                className="w-full h-40 object-cover"
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Stad</label>
            <input
              className="input"
              value={v.city ?? ""}
              onChange={(e) => setV({ ...v, city: e.target.value })}
              placeholder="Ex: Kalix"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Land</label>
            <input
              className="input"
              value={v.country ?? ""}
              onChange={(e) => setV({ ...v, country: e.target.value })}
              placeholder="Ex: SE"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pris per natt (kr)</label>
            <input
              className="input"
              type="number"
              min={0}
              value={v.price_per_night ?? 0}
              onChange={(e) =>
                setV({ ...v, price_per_night: Number(e.target.value) })
              }
              required
            />
          </div>

          <label className="flex items-center gap-2 mt-8">
            <input
              type="checkbox"
              checked={Boolean(v.availability)}
              onChange={(e) => setV({ ...v, availability: e.target.checked })}
            />
            <span>Tillgänglig</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn select-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="btn-outer">
              <span className="btn-inner">
                <span>{saving ? "Sparar…" : "Spara"}</span>
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="btn select-none"
          >
            <span className="btn-outer">
              <span className="btn-inner">
                <span>Avbryt</span>
              </span>
            </span>
          </button>
        </div>

        {msg && (
          <p className="text-sm" role="alert" aria-live="polite">
            {msg}
          </p>
        )}
      </form>
    </>
  );
}
