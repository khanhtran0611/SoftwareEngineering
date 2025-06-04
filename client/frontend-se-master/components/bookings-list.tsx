"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, Users, ArrowRight, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getUserBookings,
  getRoomForBooking,
  getHotelForBooking,
  getBookingNights,
  requestCancellation,
  cancelCancellationRequest,
} from "@/lib/bookings"
import { useToast } from "@/hooks/use-toast"
import EditReservationDialog from "@/components/edit-reservation-dialog"
import { formatVND } from "@/lib/currency"
import type { Booking, BookingStatus } from "@/types/booking"
import type { Room } from "@/types/room"
import type { Hotel } from "@/types/hotel"

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "cancel requested": "bg-orange-100 text-orange-800 border-orange-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null)
  const { toast } = useToast()
  const [roomsData, setRoomsData] = useState<Record<number, Room>>({})
  const [hotelsData, setHotelsData] = useState<Record<number, Hotel>>({})

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getUserBookings()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        toast({
          title: "Error",
          description: "Could not load bookings. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    const fetchRoomAndHotelData = async () => {
      for (const booking of bookings) {
        try {
          const room = await getRoomForBooking(booking)
          if (room) {
            setRoomsData(prev => ({ ...prev, [booking.booking_id]: room }))

            const hotel = await getHotelForBooking(booking)
            if (hotel) {
              setHotelsData(prev => ({ ...prev, [booking.booking_id]: hotel }))
            }
          }
        } catch (error) {
          console.error('Error fetching room/hotel data:', error)
        }
      }
    }

    if (bookings.length > 0) {
      fetchRoomAndHotelData()
    }
  }, [bookings])

  // Handle cancellation request
  const handleCancellationRequest = async (bookingId: number) => {
    try {
      const updatedBooking = await requestCancellation(bookingId)
      if (updatedBooking) {
        const newBookings = await getUserBookings() // Refresh the bookings list
        setBookings(newBookings)
        toast({
          title: "Cancellation requested",
          description: "Your cancellation request has been sent to the hotel owner.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to request cancellation. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error requesting cancellation:', error)
      toast({
        title: "Error",
        description: "Failed to request cancellation. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Add a new handler function in the BookingsList component after handleCancellationRequest
  const handleCancelCancellationRequest = async (bookingId: number) => {
    try {
      const updatedBooking = await cancelCancellationRequest(bookingId)
      if (updatedBooking) {
        const newBookings = await getUserBookings() // Refresh the bookings list
        setBookings(newBookings)
        toast({
          title: "Cancellation request canceled",
          description: "Your booking has been restored to pending status.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel the cancellation request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error canceling cancellation request:', error)
      toast({
        title: "Error",
        description: "Failed to cancel the cancellation request. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle edit reservation
  const handleEditReservation = (bookingId: number) => {
    setEditingBookingId(bookingId)
  }

  // Handle edit success
  const handleEditSuccess = async () => {
    try {
      const newBookings = await getUserBookings()
      setBookings(newBookings)
    } catch (error) {
      console.error('Error refreshing bookings:', error)
      toast({
        title: "Error",
        description: "Failed to refresh bookings. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Sort bookings by check-in date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <p className="text-muted-foreground">View and manage your reservations</p>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No reservations found</h3>
          <p className="mt-1 text-sm text-muted-foreground">You haven't made any reservations yet</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Explore Hotels</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {sortedBookings.map((booking) => {
            const room = roomsData[booking.booking_id]
            const hotel = hotelsData[booking.booking_id]
            const nights = getBookingNights(booking)
            if (!room || !hotel) return null

            return (
              <BookingCard
                key={booking.booking_id}
                booking={booking}
                room={room}
                hotel={hotel}
                nights={nights}
                onRequestCancellation={handleCancellationRequest}
                onCancelCancellationRequest={handleCancelCancellationRequest}
                onEditReservation={handleEditReservation}
              />
            )
          })}
        </div>
      )}

      {/* Edit Reservation Dialog */}
      {editingBookingId && (
        <EditReservationDialog
          bookingId={editingBookingId}
          open={editingBookingId !== null}
          onOpenChange={(open) => {
            if (!open) setEditingBookingId(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

type BookingCardProps = {
  booking: Booking
  room: Room
  hotel: Hotel
  nights: number
  onRequestCancellation: (bookingId: number) => void
  onCancelCancellationRequest: (bookingId: number) => void
  onEditReservation: (bookingId: number) => void
}

function BookingCard({
  booking,
  room,
  hotel,
  nights,
  onRequestCancellation,
  onCancelCancellationRequest,
  onEditReservation,
}: BookingCardProps) {
  const canEdit = booking.status === "pending"
  const canCancel = booking.status !== "cancelled" && booking.status !== "completed" && new Date(booking.check_in_date) >= new Date()
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={room.thumbnail || "/placeholder.svg?height=300&width=500&query=hotel+room"}
          alt={room.name}
          fill
          className="object-cover"
        />
        <div className="absolute right-2 top-2">
          <Badge className={`border ${statusColors[booking.status]}`}>
            {booking.status
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium">{room.name}</h3>
        <p className="text-sm text-muted-foreground">{hotel.name}</p>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(booking.check_in_date), "MMM d, yyyy")}
              <ArrowRight className="mx-1 inline h-3 w-3" />
              {format(new Date(booking.check_out_date), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.people} {booking.people === 1 ? "Guest" : "Guests"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{formatVND(booking.total_price)}</span>
            <span className="text-muted-foreground">
              {" "}
              ({nights} {nights === 1 ? "night" : "nights"})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/50 p-4 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <Link href={`/dashboard/booking/details/${booking.booking_id}`}>View Details</Link>
          </Button>

          {canEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditReservation(booking.booking_id)}
              title="Edit Reservation"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {booking.status === "pending" && canCancel && (
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onRequestCancellation(booking.booking_id)}
          >
            Request Cancellation
          </Button>
        )}

        {booking.status === "cancel requested" && (
          <Button
            variant="outline"
            className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onCancelCancellationRequest(booking.booking_id)}
          >
            Cancel Cancellation Request
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
