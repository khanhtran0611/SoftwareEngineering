"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getBookingById, updateBooking, getRoomForBooking, getHotelForBooking } from "@/lib/bookings"
import { getHotelRooms, GetRoomListFromRoomId } from "@/lib/rooms"
import { formatVND } from "@/lib/currency"
import type { Booking } from "@/types/booking"
import type { Room } from "@/types/room"

interface EditReservationDialogProps {
  bookingId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function EditReservationDialog({
  bookingId,
  open,
  onOpenChange,
  onSuccess,
}: EditReservationDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])

  // Use string dates for the form to avoid date object issues
  const [formData, setFormData] = useState({
    roomId: 0,
    checkInDate: "",
    checkOutDate: "",
    people: 1,
  })

  // Load booking data
  useEffect(() => {
    const loadData = async () => {
      if (open && bookingId) {
        try {
          // Lấy thông tin booking
          const bookingData = await getBookingById(bookingId)
          if (bookingData) {
            // Lấy danh sách phòng của khách sạn

            // tao them api lay data  list of room tu mot room luon
            const hotelRooms = await GetRoomListFromRoomId(bookingData.room_id)
            setAvailableRooms(hotelRooms)

            // Set form data
            setFormData({
              roomId: bookingData.room_id,
              checkInDate: bookingData.check_in_date,
              checkOutDate: bookingData.check_out_date,
              people: bookingData.people,
            })

            setBooking(bookingData)
          }
        } catch (error) {
          console.error('Error loading booking data:', error)
          toast({
            title: "Error",
            description: "Could not load booking details. Please try again.",
            variant: "destructive"
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [open, bookingId])

  // Handle form submission
  const handleSubmit = async () => {
    if (!booking) return

    setIsSubmitting(true)

    try {
      // Tìm phòng được chọn
      const selectedRoom = availableRooms.find((room) => room.room_id === formData.roomId)
      if (!selectedRoom) throw new Error("Room not found")

      // Format lại ngày trước khi gửi
      const formattedCheckIn = format(new Date(formData.checkInDate), 'yyyy-MM-dd')
      const formattedCheckOut = format(new Date(formData.checkOutDate), 'yyyy-MM-dd')

      // Tính số đêm
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const nights = Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      // Tính tổng tiền
      const totalPriceVND = selectedRoom.price_per_night * nights

      // Cập nhật booking
      const updatedBooking = await updateBooking({
        booking_id: bookingId,
        room_id: formData.roomId,
        status: "pending",
        check_in_date: formattedCheckIn,     // Sử dụng ngày đã format
        check_out_date: formattedCheckOut,   // Sử dụng ngày đã format
        people: formData.people,
      })

      if (updatedBooking) {
        toast({
          title: "Reservation updated",
          description: "Your reservation has been updated successfully.",
        })

        onSuccess()
        onOpenChange(false)
      } else {
        throw new Error("Failed to update reservation")
      }
    } catch (error) {
      console.error("Error updating reservation:", error)
      toast({
        title: "Error",
        description: error instanceof Error
          ? error.message
          : "There was an error updating your reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle room change
  const handleRoomChange = (roomId: string) => {
    const selectedRoom = availableRooms.find((room) => room.room_id === Number.parseInt(roomId, 10))
    if (selectedRoom) {
      setFormData((prev) => ({
        ...prev,
        roomId: selectedRoom.room_id,
        // Reset people if more than max guests
        people: prev.people > selectedRoom.max_guests ? selectedRoom.max_guests : prev.people,
      }))
    }
  }

  // Handle date changes using direct input
  const handleDateChange = (field: "checkInDate" | "checkOutDate", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle people change
  const handlePeopleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      people: Number.parseInt(value, 10),
    }))
  }

  // Get current selected room
  const selectedRoom = availableRooms.find((room) => room.room_id === formData.roomId)

  // Calculate nights and total price
  const checkIn = new Date(formData.checkInDate)
  const checkOut = new Date(formData.checkOutDate)
  const isValidDateRange = !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkOut > checkIn
  const nights = isValidDateRange
    ? Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Use VND price directly (no conversion)
  const pricePerNightVND = selectedRoom ? selectedRoom.price_per_night : 0
  const totalPriceVND = selectedRoom && isValidDateRange ? pricePerNightVND * nights : 0

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading reservation details...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
          <DialogDescription>Make changes to your reservation details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Room Selection */}
          <div className="grid gap-2">
            <Label htmlFor="room">Room Type</Label>
            <Select value={formData.roomId.toString()} onValueChange={handleRoomChange}>
              <SelectTrigger id="room">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.room_id} value={room.room_id.toString()}>
                    {room.name} - {formatVND(room.price_per_night)}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Check-in date */}
          <div className="grid gap-2">
            <Label htmlFor="check-in-date">Check-in Date</Label>
            <Input
              id="check-in-date"
              type="date"
              value={formData.checkInDate.split('T')[0]}
              onChange={(e) => handleDateChange("checkInDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full"
            />
          </div>

          {/* Check-out date */}
          <div className="grid gap-2">
            <Label htmlFor="check-out-date">Check-out Date</Label>
            <Input
              id="check-out-date"
              type="date"
              value={formData.checkOutDate.split('T')[0]}
              onChange={(e) => handleDateChange("checkOutDate", e.target.value)}
              min={formData.checkInDate ? formData.checkInDate.split('T')[0] : new Date().toISOString().split("T")[0]}
              className="w-full"
            />
          </div>

          {/* Number of Guests */}
          <div className="grid gap-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Select value={formData.people.toString()} onValueChange={handlePeopleChange}>
              <SelectTrigger id="guests">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {selectedRoom &&
                  Array.from({ length: selectedRoom.max_guests }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Updating..." : "Update Reservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
