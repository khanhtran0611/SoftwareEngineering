"use client"

import { useState, useEffect } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatVND } from "@/lib/currency"
import { getBookingsByHotelOwnerWithDetails, updateBookingStatus } from "@/lib/bookings"
import type { BookingWithDetails, BookingStatus } from "@/types/booking"
import HotelOwnerBookingDetails from "@/components/hotel-owner-booking-details"
import { getUserFromStorage } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { changeRoomAvailability } from "@/lib/rooms"
// import LoadingSpinner from "@/components/loading-spinner"

export default function HotelOwnerBookingsTable() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const user = getUserFromStorage()

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.user_id) {
        setError('User not found')
        return
      }

      try {
        setIsLoading(true)
        const data = await getBookingsByHotelOwnerWithDetails(user.user_id)
        setBookings(data)
      } catch (err) {
        setError('Failed to load bookings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [user?.user_id])

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking)
    setShowDetailsDialog(true)
  }

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus)

      if (updatedBooking) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.booking_id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        )
        if (newStatus === "accepted") {
          await changeRoomAvailability(updatedBooking.room_id, false)
        }else if(newStatus === "completed"){
          await changeRoomAvailability(updatedBooking.room_id, true)
        }

        toast({
          title: "Success",
          description: `Booking status updated to ${newStatus}`,
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to update booking status`,
        variant: "destructive",
      })
    }
  }

  const handleStatusChangeWrapper = (bookingId: number, newStatus: string) => {
    if (isValidBookingStatus(newStatus)) {
      handleStatusChange(bookingId, newStatus as BookingStatus)
      setShowDetailsDialog(false)
    }
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Rejected
          </Badge>
        )
      case "cancel requested":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Cancel Requested
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function isValidBookingStatus(status: string): status is BookingStatus {
    return ['pending', 'accepted', 'completed', 'cancelled', 'rejected', 'cancel requested'].includes(status)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Hotel & Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell className="font-medium">{booking.guest_name}</TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.hotel_name}</div>
                    <div className="text-sm text-muted-foreground">{booking.room_name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{new Date(booking.check_in_date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      to {new Date(booking.check_out_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{booking.people}</TableCell>
                  <TableCell>{formatVND(booking.total_price)}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedBooking && (
        <HotelOwnerBookingDetails
          booking={selectedBooking}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onStatusChange={handleStatusChangeWrapper}
        />
      )}
    </>
  )
}
