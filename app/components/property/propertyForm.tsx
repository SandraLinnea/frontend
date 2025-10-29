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
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">{formTitle}</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Titel</label>
        <input
          className="w-full rounded border px-3 py-2"
          required
          value={values.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ex: Röd stuga vid sjön"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Beskrivning</label>
        <textarea
          className="w-full rounded border px-3 py-2"
          rows={4}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Kort beskrivning av boendet…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stad</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={values.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Ex: Småland"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Land</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={values.country ?? ""}
            onChange={(e) => set("country", e.target.value)}
            placeholder="Ex: SE"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pris per natt (kr)</label>
          <input
            className="w-full rounded border px-3 py-2"
            type="number"
            min={0}
            value={values.price_per_night ?? 0}
            onChange={(e) => set("price_per_night", Number(e.target.value))}
            required
          />
        </div>

        <label className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={Boolean(values.availability ?? true)}
            onChange={(e) => set("availability", e.target.checked)}
          />
          <span>Tillgänglig</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Sparas..." : "Skapa"}
      </button>
    </form>
  );
}
