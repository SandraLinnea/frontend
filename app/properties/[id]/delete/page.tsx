"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiSend } from "@/utils/fetch";

type Property = {
  id?: string;
  property_code?: string;
  title: string;
};

export default function DeletePropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await apiGet<Property>(`/property/${encodeURIComponent(id)}`);
        setProperty(p);
      } catch {
        setErr("Kunde inte hämta boendet.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Är du säker på att du vill radera detta boende?")) return;
    setSubmitting(true);
    try {
      await apiSend(`/property/${encodeURIComponent(id)}`, "DELETE");
      router.replace("/properties");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Kunde inte radera.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="card max-w-lg">
        <p>Laddar…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="card max-w-lg" role="alert" aria-live="polite">
        <p>{err}</p>
      </div>
    );
  }

  return (
    <div className="card max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Radera boende</h1>
      <p>
        Du är på väg att radera: <b>{property?.title ?? id}</b>
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDelete}
          disabled={submitting}
          className="btn btn-danger select-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="btn-outer">
            <span className="btn-inner">
              <span>{submitting ? "Raderar…" : "Ja, radera"}</span>
            </span>
          </span>
        </button>

        <button
          onClick={() => router.back()}
          className="btn select-none"
          type="button"
        >
          <span className="btn-outer">
            <span className="btn-inner">
              <span>Avbryt</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
