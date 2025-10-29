import { apiGet } from "@/utils/fetch";
import type { Property } from "@/types/property";

type Paginated<T> = { data: T[]; count: number; offset: number; limit: number };

export default async function PropertiesPage() {
  const { data } = await apiGet<Paginated<Property>>("/property?limit=50&offset=0");

  return (
    <>
      <h1>Boenden</h1>
      <a href="/properties/new">+ Skapa nytt</a>
      <ul className="mt-4 space-y-2">
        {data.map((p) => {
          const id = p.property_code ?? p.id ?? "";
          return (
            <li key={id} className="border p-3">
              <div className="font-semibold">{p.title}</div>
              <div>{p.city}, {p.country} — {p.price_per_night} kr/natt</div>
              <div className="space-x-2 mt-2">
                <a href={`/properties/${encodeURIComponent(id)}`}>Visa</a>
                <a href={`/properties/${encodeURIComponent(id)}/edit`}>Redigera</a>
                <a href={`/properties/${encodeURIComponent(id)}/delete`}>Radera</a>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
