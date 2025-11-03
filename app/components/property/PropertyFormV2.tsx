"use client";

import { useState } from "react";
import type { NewProperty } from "../../types/property";

type Props = {
  formTitle?: string;
  initial?: Partial<NewProperty>;
  onSave: (data: Partial<NewProperty>) => Promise<any> | any;
};

export default function PropertyForm({
  formTitle = "Add new property",
  initial,
  onSave,
}: Props) {
  const [values, setValues] = useState<Partial<NewProperty>>({
    title: "",
    description: "",
    city: "",
    country: "",
    price_per_night: 0,
    availability: true,
    image_url: "",
    ...initial,
  });
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof NewProperty>(k: K, v: NewProperty[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        title: values.title ?? "",
        description: values.description ?? "",
        city: values.city ?? "",
        country: values.country ?? "",
        price_per_night: Number(values.price_per_night ?? 0),
        availability: Boolean(values.availability ?? true),
        image_url: values.image_url || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card max-w-xl space-y-6">
      <h2 className="text-xl font-semibold">{formTitle}</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Titel</label>
        <input
          className="input"
          required
          value={values.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ex: Röd stuga vid sjön"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Beskrivning</label>
        <textarea
          className="input"
          rows={4}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Kort beskrivning av boendet…"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Bildlänk (URL)</label>
        <input
          className="input"
          placeholder="https://exempel.se/bild.jpg"
          value={values.image_url ?? ""}
          onChange={(e) => set("image_url", e.target.value)}
        />
        {!!values.image_url && (
          <div className="mt-3 rounded-2xl overflow-hidden border">
            <img
              src={values.image_url}
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
            value={values.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Ex: Småland"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Land</label>
          <input
            className="input"
            value={values.country ?? ""}
            onChange={(e) => set("country", e.target.value)}
            placeholder="Ex: SE"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Pris per natt (kr)
          </label>
          <input
            className="input"
            type="number"
            min={0}
            value={values.price_per_night ?? 0}
            onChange={(e) => set("price_per_night", Number(e.target.value))}
            required
          />
        </div>

        <label className="flex items-center gap-2 mt-8">
          <input
            type="checkbox"
            checked={Boolean(values.availability ?? true)}
            onChange={(e) => set("availability", e.target.checked)}
          />
          <span>Tillgänglig</span>
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn select-none">
        <span className="btn-outer">
          <span className="btn-inner">
            <span>{loading ? "Sparas..." : "Skapa"}</span>
          </span>
        </span>
      </button>
    </form>
  );
}
