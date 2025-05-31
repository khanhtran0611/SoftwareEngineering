import { bookings } from "@/data/bookings"
import { rooms } from "@/data/rooms"
import { hotels } from "@/data/hotels"
import { users } from "@/data/users"
import { getUserFromStorage } from "@/lib/auth"
import type { Booking, BookingStatus, BookingWithDetails } from "@/types/booking"
import type { Room } from "@/types/room"
import type { Hotel } from "@/types/hotel"
import { api } from "@/lib/api"

// Get all bookings for the current user
export async function getUserBookings(): Promise<Booking[]> {
  const user = getUserFromStorage()
  if (!user) {
    console.error('No user found');
    return [];
  }

  try {
    const response = await api.get(`/customer/bookings/${user.user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
}

// Get all bookings for hotels owned by a specific hotel owner with details
export async function getBookingsByHotelOwnerWithDetails(ownerId: number): Promise<BookingWithDetails[]> {
  try {
    // Gọi API để lấy danh sách booking của hotel owner
    const response = await api.get(`/api/bookings/owner/${ownerId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel owner bookings:', error);
    return [];
  }
}

// Get all bookings for hotels owned by a specific hotel owner (legacy function)
export function getBookingsByHotelOwner(ownerId: number): any[] {
  // This is the old function that returns mock data
  // Keeping it for backward compatibility
  return [
    {
      id: "1",
      guest_name: "Nguyen Van A",
      hotel_name: "Bali Beach Resort",
      room_name: "Deluxe Ocean View",
      check_in: "2023-06-15",
      check_out: "2023-06-20",
      guests: 2,
      total_price: 30000000,
      status: "completed",
      booking_date: "2023-05-10T08:30:00Z",
      guest_email: "nguyen.van.a@example.com",
      guest_phone: "+84 912345678",
      special_requests: "Late check-in, around 10 PM",
      room_type: "Deluxe Ocean View",
      nights: 5,
    },
    {
      id: "2",
      guest_name: "Tran Thi B",
      hotel_name: "Ubud Jungle Retreat",
      room_name: "Premium Pool Access",
      check_in: "2023-07-01",
      check_out: "2023-07-05",
      guests: 2,
      total_price: 28000000,
      status: "completed",
      booking_date: "2023-06-05T10:15:00Z",
      guest_email: "tran.thi.b@example.com",
      guest_phone: "+84 923456789",
      special_requests: "Vegetarian meals preferred",
      room_type: "Premium Pool Access",
      nights: 4,
    },
    {
      id: "3",
      guest_name: "Le Van C",
      hotel_name: "Seminyak Boutique Hotel",
      room_name: "Family Suite",
      check_in: "2023-08-10",
      check_out: "2023-08-15",
      guests: 4,
      total_price: 35000000,
      status: "completed",
      booking_date: "2023-07-15T14:20:00Z",
      guest_email: "le.van.c@example.com",
      guest_phone: "+84 934567890",
      special_requests: "Extra bed for child",
      room_type: "Family Suite",
      nights: 5,
    },
    {
      id: "4",
      guest_name: "Pham Thi D",
      hotel_name: "Canggu Surf Lodge",
      room_name: "Beachfront Villa",
      check_in: "2023-09-05",
      check_out: "2023-09-10",
      guests: 2,
      total_price: 42000000,
      status: "completed",
      booking_date: "2023-08-01T09:45:00Z",
      guest_email: "pham.thi.d@example.com",
      guest_phone: "+84 945678901",
      special_requests: "Surf lessons booking",
      room_type: "Beachfront Villa",
      nights: 5,
    },
    {
      id: "5",
      guest_name: "Hoang Van E",
      hotel_name: "Bali Beach Resort",
      room_name: "Garden View Room",
      check_in: "2023-10-15",
      check_out: "2023-10-20",
      guests: 2,
      total_price: 25000000,
      status: "accepted",
      booking_date: "2023-09-20T11:30:00Z",
      guest_email: "hoang.van.e@example.com",
      guest_phone: "+84 956789012",
      special_requests: "Airport pickup",
      room_type: "Garden View Room",
      nights: 5,
    },
    {
      id: "6",
      guest_name: "Vu Thi F",
      hotel_name: "Ubud Jungle Retreat",
      room_name: "Forest View Suite",
      check_in: "2023-11-01",
      check_out: "2023-11-05",
      guests: 2,
      total_price: 32000000,
      status: "accepted",
      booking_date: "2023-10-05T13:15:00Z",
      guest_email: "vu.thi.f@example.com",
      guest_phone: "+84 967890123",
      special_requests: "Honeymoon decoration",
      room_type: "Forest View Suite",
      nights: 4,
    },
    {
      id: "7",
      guest_name: "Dang Van G",
      hotel_name: "Jimbaran Bay Resort",
      room_name: "Private Pool Villa",
      check_in: "2023-12-10",
      check_out: "2023-12-15",
      guests: 2,
      total_price: 45000000,
      status: "accepted",
      booking_date: "2023-11-15T10:00:00Z",
      guest_email: "dang.van.g@example.com",
      guest_phone: "+84 978901234",
      special_requests: "Romantic dinner setup",
      room_type: "Private Pool Villa",
      nights: 5,
    },
    {
      id: "8",
      guest_name: "Bui Thi H",
      hotel_name: "Tanah Lot Resort",
      room_name: "Deluxe Room",
      check_in: "2024-01-05",
      check_out: "2024-01-10",
      guests: 2,
      total_price: 27000000,
      status: "accepted",
      booking_date: "2023-12-01T15:30:00Z",
      guest_email: "bui.thi.h@example.com",
      guest_phone: "+84 989012345",
      special_requests: "Early check-in if possible",
      room_type: "Deluxe Room",
      nights: 5,
    },
    {
      id: "9",
      guest_name: "Nguyen Van I",
      hotel_name: "Bali Beach Resort",
      room_name: "Rooftop Suite",
      check_in: "2024-02-15",
      check_out: "2024-02-20",
      guests: 2,
      total_price: 38000000,
      status: "accepted",
      booking_date: "2024-01-10T09:15:00Z",
      guest_email: "nguyen.van.i@example.com",
      guest_phone: "+84 990123456",
      special_requests: "Birthday celebration",
      room_type: "Rooftop Suite",
      nights: 5,
    },
    {
      id: "10",
      guest_name: "Tran Van J",
      hotel_name: "Seminyak Boutique Hotel",
      room_name: "Garden View Standard",
      check_in: "2024-03-01",
      check_out: "2024-03-05",
      guests: 2,
      total_price: 22000000,
      status: "pending",
      booking_date: "2024-02-01T14:00:00Z",
      guest_email: "tran.van.j@example.com",
      guest_phone: "+84 901234567",
      special_requests: "Non-smoking room",
      room_type: "Garden View Standard",
      nights: 4,
    },
    {
      id: "11",
      guest_name: "Le Thi K",
      hotel_name: "Canggu Surf Lodge",
      room_name: "Ocean View Room",
      check_in: "2024-04-10",
      check_out: "2024-04-15",
      guests: 2,
      total_price: 29000000,
      status: "pending",
      booking_date: "2024-03-05T11:45:00Z",
      guest_email: "le.thi.k@example.com",
      guest_phone: "+84 912345678",
      special_requests: "High floor room",
      room_type: "Ocean View Room",
      nights: 5,
    },
    {
      id: "12",
      guest_name: "Pham Van L",
      hotel_name: "Jimbaran Bay Resort",
      room_name: "Family Room",
      check_in: "2024-05-01",
      check_out: "2024-05-06",
      guests: 4,
      total_price: 33000000,
      status: "pending",
      booking_date: "2024-04-01T10:30:00Z",
      guest_email: "pham.van.l@example.com",
      guest_phone: "+84 923456789",
      special_requests: "Baby crib needed",
      room_type: "Family Room",
      nights: 5,
    },
    {
      id: "13",
      guest_name: "Hoang Thi M",
      hotel_name: "Tanah Lot Resort",
      room_name: "Executive Suite",
      check_in: "2024-06-15",
      check_out: "2024-06-20",
      guests: 2,
      total_price: 40000000,
      status: "pending",
      booking_date: "2024-05-10T13:00:00Z",
      guest_email: "hoang.thi.m@example.com",
      guest_phone: "+84 934567890",
      special_requests: "Business facilities needed",
      room_type: "Executive Suite",
      nights: 5,
    },
    {
      id: "14",
      guest_name: "Vu Van N",
      hotel_name: "Bali Beach Resort",
      room_name: "Sunset View Room",
      check_in: "2024-07-01",
      check_out: "2024-07-05",
      guests: 2,
      total_price: 26000000,
      status: "pending",
      booking_date: "2024-06-01T09:00:00Z",
      guest_email: "vu.van.n@example.com",
      guest_phone: "+84 945678901",
      special_requests: "Sunset view preferred",
      room_type: "Sunset View Room",
      nights: 4,
    },
    {
      id: "15",
      guest_name: "Dang Thi O",
      hotel_name: "Ubud Jungle Retreat",
      room_name: "Bay View Suite",
      check_in: "2024-08-10",
      check_out: "2024-08-15",
      guests: 2,
      total_price: 36000000,
      status: "pending",
      booking_date: "2024-07-05T14:30:00Z",
      guest_email: "dang.thi.o@example.com",
      guest_phone: "+84 956789012",
      special_requests: "Quiet room away from elevator",
      room_type: "Bay View Suite",
      nights: 5,
    },
    {
      id: "16",
      guest_name: "Bui Van P",
      hotel_name: "Seminyak Boutique Hotel",
      room_name: "Deluxe Ocean View",
      check_in: "2023-05-15",
      check_out: "2023-05-20",
      guests: 2,
      total_price: 30000000,
      status: "cancelled",
      booking_date: "2023-04-10T10:00:00Z",
      guest_email: "bui.van.p@example.com",
      guest_phone: "+84 967890123",
      special_requests: "No special requests",
      room_type: "Deluxe Ocean View",
      nights: 5,
    },
    {
      id: "17",
      guest_name: "Nguyen Thi Q",
      hotel_name: "Canggu Surf Lodge",
      room_name: "Premium Pool Access",
      check_in: "2023-06-01",
      check_out: "2023-06-05",
      guests: 2,
      total_price: 28000000,
      status: "rejected",
      booking_date: "2023-05-01T11:15:00Z",
      guest_email: "nguyen.thi.q@example.com",
      guest_phone: "+84 978901234",
      special_requests: "No special requests",
      room_type: "Premium Pool Access",
      nights: 4,
    },
  ]
}

// Get a specific booking by ID
export async function getBookingById(bookingId: number): Promise<Booking | undefined> {
  try {
    const response = await api.get(`/customer/bookingdetail/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return undefined;
  }
}

// Get room details for a booking
export async function getRoomForBooking(booking: Booking): Promise<Room | undefined> {
  try {
    const response = await api.get(`/customer/roomdetail/${booking.room_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    return undefined;
  }
}

// Get hotel details for a booking
export async function getHotelForBooking(booking: Booking): Promise<Hotel | undefined> {
  try {
    const room = await getRoomForBooking(booking)
    if (!room) return undefined

    const response = await api.get(`/customer/hotels/${room.hotel_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return undefined;
  }
}

// Calculate number of nights for a booking
export function getBookingNights(booking: Booking): number {
  const checkIn = new Date(booking.check_in_date)
  const checkOut = new Date(booking.check_out_date)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, "booking_id" | "created_at">): Promise<Booking> {
  const user = getUserFromStorage()
  if (!user) {
    throw new Error("User must be logged in to create a booking")
  }
  
  try {
    const response = await api.post('/customer/ordering', {
      ...bookingData,
      user_id: user.user_id
    })
    console.log(response)
    return response.data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// Update booking status
export async function updateBookingStatus(bookingId: number, status: BookingStatus): Promise<Booking | undefined> {
  try {
    // Gọi API để update status
    const response = await api.put(`/customer/${bookingId}/changestatus`, {
      status: status
    });

    // Trả về booking đã được update từ response
    return response.data;

  } catch (error) {
    // Log lỗi
    console.error('Error updating booking status:', error);

    // Có thể throw error hoặc return undefined tùy use case
    return undefined;
  }
}

// Update booking details
export async function updateBooking(
  updates: Partial<Omit<Booking, "user_id" | "created_at" | "total_price">>,
): Promise<Booking | undefined> {
  try {
    const response = await api.put(`/customer/editbooking`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return undefined;
  }
}

// Request cancellation for a booking
export async function requestCancellation(bookingId: number): Promise<Booking | undefined> {
  return await updateBookingStatus(bookingId, "cancel requested")
}

// Cancel a cancellation request
export async function cancelCancellationRequest(bookingId: number): Promise<Booking | undefined> {
  return await updateBookingStatus(bookingId, "pending")
}

export async function acceptBooking(bookingId: number): Promise<Booking | undefined> {
  return await updateBookingStatus(bookingId, "accepted")
}

export async function rejectBooking(bookingId: number): Promise<Booking | undefined> {
  return await updateBookingStatus(bookingId, "rejected")
}

export async function appoveCancellation(bookingId: number): Promise<Booking | undefined> {
  return await updateBookingStatus(bookingId, "cancelled")
}


// Calculate total price for a booking
export function calculateTotalPrice(roomId: number, checkInDate: string, checkOutDate: string, people: number): number {
  const room = rooms.find((r) => r.room_id === roomId)
  if (!room) throw new Error("Room not found")

  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const nights = Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  return room.price_per_night * nights
}
