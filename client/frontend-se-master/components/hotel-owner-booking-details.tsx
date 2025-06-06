"use client"

import { Calendar, Clock, CreditCard, MapPin, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { BookingWithDetails } from "@/types/booking"
import { formatVND } from "@/lib/currency"

interface HotelOwnerBookingDetailsProps {
  booking: BookingWithDetails
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (bookingId: number, newStatus: string) => void
}

export default function HotelOwnerBookingDetails({
  booking,
  open,
  onOpenChange,
  onStatusChange,
}: HotelOwnerBookingDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      case "rejected":
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date)
    const checkOut = new Date(booking.check_out_date)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            {getStatusBadge(booking.status)}
          </DialogTitle>
          <DialogDescription>Booking ID: {booking.booking_id}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Guest Information</h3>
              <div className="mt-2 flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{booking.guest_name}</span>
              </div>
              <div className="mt-1 flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm">Payment: Credit Card</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Stay Information</h3>
              <div className="mt-2 flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.people} Guests</span>
              </div>
              <div className="mt-1 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm">{calculateNights()} Nights</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Hotel & Room</h3>
            <div className="mt-2 flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">{booking.hotel_name}</span>
            </div>
            <div className="mt-1 ml-6 text-sm">{booking.room_name}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Dates</h3>
            <div className="mt-2 flex items-start">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm">
                  <span className="font-medium">Check-in:</span> {formatDate(booking.check_in_date)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Check-out:</span> {formatDate(booking.check_out_date)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-500">Payment Summary</h3>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Room Rate ({calculateNights()} nights)</span>
                <span>{formatVND(booking.total_price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatVND(booking.total_price)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div>
            {booking.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="default" onClick={() => onStatusChange(booking.booking_id, "accepted")}>
                  Accept
                </Button>
                <Button variant="outline" onClick={() => onStatusChange(booking.booking_id, "rejected")}>
                  Reject
                </Button>
              </div>
            )}
            {booking.status === "accepted" && (
              <div className="flex gap-2">
                <Button variant="default" onClick={() => onStatusChange(booking.booking_id, "completed")}>
                  Mark as Completed
                </Button>
                <Button variant="outline" onClick={() => onStatusChange(booking.booking_id, "cancelled")}>
                  Cancel Booking
                </Button>
              </div>
            )}
             {booking.status === "cancel requested" && (
              <div className="flex gap-2">
                <Button variant="default" onClick={() => onStatusChange(booking.booking_id, "cancelled")}>
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
