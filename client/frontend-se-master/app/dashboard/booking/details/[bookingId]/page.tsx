"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, Users, ArrowRight, AlertTriangle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  getBookingById,
  getRoomForBooking,
  getHotelForBooking,
  getBookingNights,
  requestCancellation,
  cancelCancellationRequest,
} from "@/lib/bookings"
import { getUserFromStorage } from "@/lib/auth"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditReservationDialog from "@/components/edit-reservation-dialog"
import { formatVND } from "@/lib/currency"
import type { Booking } from "@/types/booking"
import type { Room } from "@/types/room"
import type { Hotel } from "@/types/hotel"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "cancel requested": "bg-orange-100 text-orange-800 border-orange-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function BookingDetailsPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const bookingId = Number.parseInt(resolvedParams.bookingId, 10)

  // Function to load booking data
  const loadBookingData = async () => {
    try {
      const bookingData = await getBookingById(bookingId)
      if (!bookingData) {
        toast({
          title: "Error",
          description: "Booking not found",
          variant: "destructive"
        })
        router.push("/dashboard/bookings")
        return
      }

      // Get room and hotel details
      const roomData = await getRoomForBooking(bookingData)
      const hotelData = await getHotelForBooking(bookingData)

      setBooking(bookingData)
      setRoom(roomData || null)
      setHotel(hotelData || null)
    } catch (error) {
      console.error('Error loading booking data:', error)
      toast({
        title: "Error",
        description: "Could not load booking details. Please try again.",
        variant: "destructive"
      })
      router.push("/dashboard/bookings")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const user = getUserFromStorage()
    if (!user) {
      router.push("/")
      return
    }

    loadBookingData()
  }, [bookingId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading reservation details...</p>
      </div>
    )
  }

  if (!booking || !room || !hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Reservation not found</p>
      </div>
    )
  }

  const nights = getBookingNights(booking)
  const canCancel =
    booking.status !== "cancelled" && booking.status !== "completed" && new Date(booking.check_in_date) > new Date()
  const canEdit = booking.status === "pending"

  const handleCancelBooking = async () => {
    try {
      const updatedBooking = await requestCancellation(bookingId)
      if (updatedBooking) {
        setBooking(updatedBooking)
        toast({
          title: "Cancellation requested",
          description: "Your cancellation request has been sent to the hotel owner.",
        })
      } else {
        throw new Error("Failed to request cancellation")
      }
    } catch (error) {
      console.error('Error requesting cancellation:', error)
      toast({
        title: "Error",
        description: "Failed to request cancellation. Please try again.",
        variant: "destructive"
      })
    }
    setIsCancelDialogOpen(false)
  }

  const handleCancelCancellationRequest = async () => {
    try {
      const updatedBooking = await cancelCancellationRequest(bookingId)
      if (updatedBooking) {
        setBooking(updatedBooking)
        toast({
          title: "Cancellation request canceled",
          description: "Your booking has been restored to pending status.",
        })
      } else {
        throw new Error("Failed to cancel cancellation request")
      }
    } catch (error) {
      console.error('Error canceling cancellation request:', error)
      toast({
        title: "Error",
        description: "Failed to cancel the cancellation request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEditSuccess = async () => {
    await loadBookingData()
    toast({
      title: "Reservation updated",
      description: "Your reservation has been updated successfully.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => { }} onFilter={() => { }} />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/bookings")} className="mb-4">
              ← Back to Reservations
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">Reservation Details</h1>
              <Badge className={`border ${statusColors[booking.status]}`}>
                {booking.status
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">Reservation #{booking.booking_id}</p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{hotel.name}</CardDescription>
              </div>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-32 w-full sm:w-1/3">
                  <Image
                    src={room.thumbnail || "/placeholder.svg?height=300&width=500&query=hotel+room"}
                    alt={room.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(booking.check_in_date), "EEE, MMM d, yyyy")}
                      <ArrowRight className="mx-1 inline h-3 w-3" />
                      {format(new Date(booking.check_out_date), "EEE, MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.people} {booking.people === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{room.description}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Payment Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>Room rate</span>
                  <span>
                    {formatVND(booking.total_price / nights)} × {nights} nights
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatVND(booking.total_price)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">* Payment will be collected at the property</p>
              </div>

              <Separator />

              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Important Information</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Check-in time: 2:00 PM</li>
                  <li>• Check-out time: 12:00 PM</li>
                  <li>• Please present your ID at check-in</li>
                  <li>• Free cancellation until 48 hours before check-in</li>
                </ul>
              </div>

              {booking.status === "cancelled" && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-800">Reservation Cancelled</h4>
                      <p className="text-sm text-red-700">
                        This reservation has been cancelled and is no longer valid.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {booking.status === "cancel requested" && (
                <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-800">Cancellation Requested</h4>
                      <p className="text-sm text-orange-700">
                        Your cancellation request is pending approval from the hotel owner.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/bookings")}>
                Back to Reservations
              </Button>

              {canCancel && booking.status === "pending" && (
                <Button variant="destructive" className="w-full sm:w-auto" onClick={() => setIsCancelDialogOpen(true)}>
                  Request Cancellation
                </Button>
              )}

              {booking.status === "cancel requested" && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={handleCancelCancellationRequest}
                >
                  Cancel Cancellation Request
                </Button>
              )}
            </CardFooter>
          </Card>

          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Cancellation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to request cancellation of this reservation? This request will be sent to the
                  hotel owner for approval.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, Keep Reservation</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive text-destructive-foreground">
                  Yes, Request Cancellation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Reservation Dialog */}
          {canEdit && (
            <EditReservationDialog
              bookingId={bookingId}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              onSuccess={handleEditSuccess}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
