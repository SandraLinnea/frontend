export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type NewBooking = {
  property_id: string;
  start_date: string;
  end_date: string;
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
