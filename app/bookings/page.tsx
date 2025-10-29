import { apiGet } from "@/utils/fetch";
import type { Booking } from "@/types/booking";

export default async function BookingsPage() {
  const list = await apiGet<Booking[]>("/booking");

  return (
    <>
      <h1>Mina bokningar</h1>
      <ul className="mt-4 space-y-2">
        {list.map(b => (
          <li key={b.id} className="border p-3">
            <div><b>Property:</b> {b.property_id}</div>
            <div><b>Datum:</b> {b.start_date} → {b.end_date}</div>
            <div><b>Gäster:</b> {b.guests ?? 1}</div>
            <div><b>Status:</b> {b.status}</div>
            <div><b>Pris:</b> {b.total_price} kr</div>
          </li>
        ))}
      </ul>
    </>
  );
}
