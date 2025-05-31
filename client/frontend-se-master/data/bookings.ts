import type { Booking } from "@/types/booking"

export const bookings: Booking[] = [
  // Existing customer bookings
  {
    booking_id: 1,
    user_id: 1,
    room_id: 1,
    status: "pending",
    total_price: 18000000, // 18,000,000 VND (3 nights × 6,000,000 VND)
    check_in_date: "2023-12-15",
    check_out_date: "2023-12-18",
    created_at: "2023-11-20T14:30:00Z",
    people: 2,
  },
  {
    booking_id: 2,
    user_id: 1,
    room_id: 7,
    status: "completed",
    total_price: 32400000, // 32,400,000 VND (3 nights × 10,800,000 VND)
    check_in_date: "2023-10-05",
    check_out_date: "2023-10-08",
    created_at: "2023-09-15T09:45:00Z",
    people: 2,
  },
  {
    booking_id: 3,
    user_id: 1,
    room_id: 3,
    status: "cancelled",
    total_price: 54000000, // 54,000,000 VND (5 nights × 10,800,000 VND)
    check_in_date: "2024-01-10",
    check_out_date: "2024-01-15",
    created_at: "2023-12-01T16:20:00Z",
    people: 4,
  },
  {
    booking_id: 4,
    user_id: 1,
    room_id: 5,
    status: "pending",
    total_price: 21500000, // 21,500,000 VND (5 nights × 4,300,000 VND)
    check_in_date: "2024-06-15",
    check_out_date: "2024-06-20",
    created_at: "2024-05-01T10:15:00Z",
    people: 2,
  },
  {
    booking_id: 5,
    user_id: 1,
    room_id: 9,
    status: "pending",
    total_price: 20100000, // 20,100,000 VND (3 nights × 6,700,000 VND)
    check_in_date: "2024-07-10",
    check_out_date: "2024-07-13",
    created_at: "2024-05-05T14:30:00Z",
    people: 3,
  },

  // Additional sample bookings for hotel owners to manage
  {
    booking_id: 6,
    user_id: 2,
    room_id: 1, // Deluxe Ocean View - Bali Beach Resort
    status: "pending",
    total_price: 12000000, // 2 nights × 6,000,000 VND
    check_in_date: "2024-02-14",
    check_out_date: "2024-02-16",
    created_at: "2024-02-01T09:30:00Z",
    people: 2,
  },
  {
    booking_id: 7,
    user_id: 3,
    room_id: 2, // Premium Pool Access - Bali Beach Resort
    status: "accepted",
    total_price: 22500000, // 3 nights × 7,500,000 VND
    check_in_date: "2024-02-20",
    check_out_date: "2024-02-23",
    created_at: "2024-02-05T14:15:00Z",
    people: 2,
  },
  {
    booking_id: 8,
    user_id: 4,
    room_id: 4, // Beachfront Villa - Bali Beach Resort
    status: "completed",
    total_price: 55600000, // 4 nights × 13,900,000 VND
    check_in_date: "2024-01-15",
    check_out_date: "2024-01-19",
    created_at: "2024-01-01T11:45:00Z",
    people: 4,
  },
  {
    booking_id: 9,
    user_id: 5,
    room_id: 5, // Garden View Room - Ubud Jungle Retreat
    status: "pending",
    total_price: 12900000, // 3 nights × 4,300,000 VND
    check_in_date: "2024-03-01",
    check_out_date: "2024-03-04",
    created_at: "2024-02-15T16:20:00Z",
    people: 2,
  },
  {
    booking_id: 10,
    user_id: 6,
    room_id: 6, // Forest View Suite - Ubud Jungle Retreat
    status: "accepted",
    total_price: 26800000, // 4 nights × 6,700,000 VND
    check_in_date: "2024-03-10",
    check_out_date: "2024-03-14",
    created_at: "2024-02-20T10:30:00Z",
    people: 3,
  },
  {
    booking_id: 11,
    user_id: 7,
    room_id: 7, // Private Pool Villa - Ubud Jungle Retreat
    status: "rejected",
    total_price: 32400000, // 3 nights × 10,800,000 VND
    check_in_date: "2024-02-25",
    check_out_date: "2024-02-28",
    created_at: "2024-02-10T13:45:00Z",
    people: 2,
  },
  {
    booking_id: 12,
    user_id: 8,
    room_id: 8, // Deluxe Room - Seminyak Boutique Hotel
    status: "completed",
    total_price: 28800000, // 6 nights × 4,800,000 VND
    check_in_date: "2024-01-20",
    check_out_date: "2024-01-26",
    created_at: "2024-01-05T15:20:00Z",
    people: 2,
  },
  {
    booking_id: 13,
    user_id: 9,
    room_id: 9, // Rooftop Suite - Seminyak Boutique Hotel
    status: "pending",
    total_price: 20100000, // 3 nights × 6,700,000 VND
    check_in_date: "2024-03-15",
    check_out_date: "2024-03-18",
    created_at: "2024-03-01T08:15:00Z",
    people: 2,
  },
  {
    booking_id: 14,
    user_id: 10,
    room_id: 10, // Garden View Standard - Canggu Surf Lodge
    status: "accepted",
    total_price: 14400000, // 4 nights × 3,600,000 VND
    check_in_date: "2024-03-20",
    check_out_date: "2024-03-24",
    created_at: "2024-03-05T12:30:00Z",
    people: 2,
  },
  {
    booking_id: 15,
    user_id: 11,
    room_id: 11, // Ocean View Room - Canggu Surf Lodge
    status: "pending",
    total_price: 24000000, // 5 nights × 4,800,000 VND
    check_in_date: "2024-04-01",
    check_out_date: "2024-04-06",
    created_at: "2024-03-15T17:45:00Z",
    people: 3,
  },
  {
    booking_id: 16,
    user_id: 12,
    room_id: 12, // Family Room - Jimbaran Bay Resort
    status: "accepted",
    total_price: 32000000, // 4 nights × 8,000,000 VND
    check_in_date: "2024-04-10",
    check_out_date: "2024-04-14",
    created_at: "2024-03-25T09:20:00Z",
    people: 4,
  },
  {
    booking_id: 17,
    user_id: 13,
    room_id: 13, // Executive Suite - Jimbaran Bay Resort
    status: "completed",
    total_price: 43200000, // 4 nights × 10,800,000 VND
    check_in_date: "2024-02-01",
    check_out_date: "2024-02-05",
    created_at: "2024-01-15T14:10:00Z",
    people: 2,
  },
  {
    booking_id: 18,
    user_id: 14,
    room_id: 14, // Sunset View Room - Tanah Lot Resort
    status: "pending",
    total_price: 30000000, // 5 nights × 6,000,000 VND
    check_in_date: "2024-04-15",
    check_out_date: "2024-04-20",
    created_at: "2024-04-01T11:30:00Z",
    people: 2,
  },
  {
    booking_id: 19,
    user_id: 15,
    room_id: 15, // Bay View Suite - Tanah Lot Resort
    status: "accepted",
    total_price: 48000000, // 4 nights × 12,000,000 VND
    check_in_date: "2024-05-01",
    check_out_date: "2024-05-05",
    created_at: "2024-04-10T16:45:00Z",
    people: 3,
  },
  {
    booking_id: 20,
    user_id: 16,
    room_id: 1, // Another booking for Deluxe Ocean View
    status: "cancelled",
    total_price: 18000000, // 3 nights × 6,000,000 VND
    check_in_date: "2024-03-25",
    check_out_date: "2024-03-28",
    created_at: "2024-03-10T13:20:00Z",
    people: 2,
  },
]
