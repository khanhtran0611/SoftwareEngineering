"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getRoomById, getHotelForRoom, changeRoomAvailability } from "@/lib/rooms"
import { getUserFromStorage } from "@/lib/auth"
import { createBooking } from "@/lib/bookings"
import { formatVND } from "@/lib/currency"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Hotel } from "@/types/hotel"
import { Room } from "@/types/room"

type BookingFormProps = {
  roomId: number
}

export default function BookingForm({ roomId }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const user = getUserFromStorage()

  // Thêm states để quản lý room và loading
  const [room, setRoom] = useState<Room | undefined>()
  const [hotel, setHotel] = useState<Hotel | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    checkInDate: new Date(),
    checkOutDate: addDays(new Date(), 3),
    guests: 1,
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch room data khi component mount
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoomById(roomId)
        setRoom(roomData)

        if (roomData) {
          // Sử dụng getHotelForRoom thay vì getHotelForBooking
          const hotelData = await getHotelForRoom(roomId)
          setHotel(hotelData)
        }
      } catch (error) {
        console.error('Error fetching room/hotel:', error)
        toast({
          title: "Error",
          description: "Could not load room details. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomData()
  }, [roomId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading room details...</p>
      </div>
    )
  }

  if (!room || !user || !hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Could not load room details. Please try again later.</p>
      </div>
    )
  }

  const nights = Math.ceil(
    Math.abs(formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  // Calculate total price in VND
  const totalPriceVND = room.price_per_night * nights

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGuestsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, guests: Number.parseInt(value, 10) }))
  }

  // Thêm hàm helper để format date (đặt ở đầu component)
  function formatDateForInput(date: Date): string {
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    return adjustedDate.toISOString().split('T')[0]
  }

  // Sửa lại hàm handleCheckInChange
  const handleCheckInChange = (date: Date | undefined) => {
    if (date) {
      const offset = date.getTimezoneOffset()
      const adjustedDate = new Date(date.getTime() + (offset * 60 * 1000))
      const newCheckIn = adjustedDate
      // Ensure check-out is after check-in
      const newCheckOut = formData.checkOutDate < adjustedDate ? addDays(adjustedDate, 1) : formData.checkOutDate
      setFormData((prev) => ({ ...prev, checkInDate: newCheckIn, checkOutDate: newCheckOut }))
    }
  }

  // Sửa lại hàm handleCheckOutChange
  const handleCheckOutChange = (date: Date | undefined) => {
    if (date) {
      const offset = date.getTimezoneOffset()
      const adjustedDate = new Date(date.getTime() + (offset * 60 * 1000))
      if (adjustedDate > formData.checkInDate) {
        setFormData((prev) => ({ ...prev, checkOutDate: adjustedDate }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const booking = await createBooking({
        user_id: user.user_id,
        room_id: roomId,
        status: "pending",
        total_price: totalPriceVND,
        check_in_date: formatDateForInput(formData.checkInDate),
        check_out_date: formatDateForInput(formData.checkOutDate),
        people: formData.guests,
      })

      toast({
        title: "Reservation created",
        description: "Your reservation has been created successfully.",
      })
      console.log(booking)
      // Redirect to success page
      await router.push(`/dashboard/booking/success/${booking.booking_id}`)
    } catch (error) {
      console.error("Booking creation failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error
          ? error.message
          : "There was an error creating your reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={() => { }} onFilter={() => { }} />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">Complete Your Reservation</h1>
            <p className="text-muted-foreground">
              You're reserving {room.name} at {hotel.name}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                    <CardDescription>Please provide your contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reservation Details</CardTitle>
                    <CardDescription>Select your stay dates and number of guests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkInDate">Check-in Date</Label>
                        <Input
                          id="checkInDate"
                          name="checkInDate"
                          type="date"
                          value={formatDateForInput(formData.checkInDate)}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            handleCheckInChange(date)
                          }}
                          min={formatDateForInput(new Date())}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="checkOutDate">Check-out Date</Label>
                        <Input
                          id="checkOutDate"
                          name="checkOutDate"
                          type="date"
                          value={formatDateForInput(formData.checkOutDate)}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            handleCheckOutChange(date)
                          }}
                          min={formatDateForInput(addDays(formData.checkInDate, 1))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Guests</Label>
                      <Select value={formData.guests.toString()} onValueChange={handleGuestsChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: room.max_guests }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Input
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or preferences?"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Complete Reservation"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Reservation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-md">
                    <Image
                      src={room.thumbnail || "/placeholder.svg?height=300&width=500&query=hotel+room"}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{hotel.name}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Check-in</span>
                      <span className="font-medium">{format(formData.checkInDate, "EEE, MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Check-out</span>
                      <span className="font-medium">{format(formData.checkOutDate, "EEE, MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Length of stay</span>
                      <span className="font-medium">
                        {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Guests</span>
                      <span className="font-medium">{formData.guests}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Room rate</span>
                      <span>{formatVND(room.price_per_night)} per night</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatVND(totalPriceVND)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">* Payment will be collected at the property</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
