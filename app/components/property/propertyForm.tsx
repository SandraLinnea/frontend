"use client";

import { useState } from "react";
import type { NewProperty } from "@/types/property";

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
    <form onSubmit={submit}>
      <h2>{formTitle}</h2>

      <div>
        <label>Titel</label>
        <input
          required
          value={values.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div>
        <label>Beskrivning</label>
        <textarea
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div>
        <div>
          <label>Stad</label>
          <input
            value={values.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <label>Land</label>
          <input
            value={values.country ?? ""}
            onChange={(e) => set("country", e.target.value)}
          />
        </div>
      </div>

      <div>
        <div>
          <label>Pris per natt (kr)</label>
          <input
            type="number"
            min={0}
            value={values.price_per_night ?? 0}
            onChange={(e) => set("price_per_night", Number(e.target.value))}
            required
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={Boolean(values.availability ?? true)}
            onChange={(e) => set("availability", e.target.checked)}
          />
          <span>Tillgänglig</span>
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Sparas..." : "Skapa"}
      </button>
    </form>
  );
}
