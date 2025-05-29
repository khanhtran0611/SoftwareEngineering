export type BookingStatus = "pending" | "cancel requested" | "accepted" | "rejected" | "completed" | "cancelled"

export type Booking = {
  booking_id: number
  user_id: number
  room_id: number
  status: BookingStatus
  total_price: number
  check_in_date: string
  check_out_date: string
  created_at: string
  people: number
}

// Extended type for display purposes with joined data
export type BookingWithDetails = Booking & {
  guest_name: string
  hotel_name: string
  room_name: string
}

