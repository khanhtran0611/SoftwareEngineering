"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { CheckCircle, Calendar, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getBookingById, getRoomForBooking, getHotelForBooking, getBookingNights } from "@/lib/bookings"
import { getUserFromStorage } from "@/lib/auth"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Booking } from "@/types/booking"
import type { Room } from "@/types/room"
import type { Hotel } from "@/types/hotel"

export default function ReservationSuccessPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const router = useRouter()

  // Unwrap the async params
  const resolvedParams = use(params)
  const bookingId = Number.parseInt(resolvedParams.bookingId, 10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const user = getUserFromStorage()
        if (!user) {
          router.push("/")
          return
        }

        // Get booking details
        const bookingData = await getBookingById(bookingId)
        if (!bookingData) {
          router.push("/dashboard/bookings")
          return
        }

        // Get room and hotel details
        const roomData = await getRoomForBooking(bookingData)
        const hotelData = await getHotelForBooking(bookingData)

        setBooking(bookingData)
        setRoom(roomData || null)
        setHotel(hotelData || null)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching booking details:", error)
        router.push("/dashboard/bookings")
      }
    }

    fetchData()
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => { }} onFilter={() => { }} />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Reservation Confirmed!</h1>
            <p className="text-muted-foreground">
              Your reservation has been successfully confirmed. Thank you for choosing us!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>Reservation #{booking.booking_id}</CardDescription>
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
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">{hotel.name}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(booking.check_in_date), "MMM d, yyyy")}
                      <ArrowRight className="mx-1 inline h-3 w-3" />
                      {format(new Date(booking.check_out_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.people} {booking.people === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Stay Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>Room rate</span>
                  <span>
                    ${(booking.total_price / nights).toFixed(2)} × {nights} nights
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total amount</span>
                  <span>${booking.total_price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">* Payment will be collected at the property</p>
              </div>

              <Separator />

              <div className="rounded-md bg-muted p-4">
                <h3 className="mb-2 font-medium">Important Information</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Check-in time: 2:00 PM</li>
                  <li>• Check-out time: 12:00 PM</li>
                  <li>• Please present your ID at check-in</li>
                  <li>• Free cancellation until 48 hours before check-in</li>
                  <li>• Your reservation is pending confirmation from the hotel</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard/bookings")}>
                View All Reservations
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
