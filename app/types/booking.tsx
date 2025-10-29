export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type NewBooking = {
  property_id: string;   // uuid ELLER property_code (backend stödjer båda)
  start_date: string;    // "YYYY-MM-DD"
  end_date: string;      // "YYYY-MM-DD"
  guests?: number;
  note?: string;
};

export type Booking = NewBooking & {
  id: string;
  booking_id: string;
  user_id: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
};
