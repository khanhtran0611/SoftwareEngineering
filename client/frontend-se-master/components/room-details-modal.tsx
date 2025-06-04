"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Users, Coins, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import RoomServices from "@/components/room-services"
import { formatVND } from "@/lib/currency"
import type { Room } from "@/types/room"

type RoomDetailsModalProps = {
  room: Room | null
  isOpen: boolean
  onClose: () => void
}

export default function RoomDetailsModal({ room, isOpen, onClose }: RoomDetailsModalProps) {
  const { toast } = useToast()
  const router = useRouter()

  if (!room) {
    return null
  }

  const handleBookNow = () => {
    if (room.availability) {
      router.push(`/dashboard/booking/${room.room_id}`)
    } else {
      toast({
        title: "Room not available",
        description: "This room is currently not available for booking.",
        variant: "destructive",
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{room.name}</DialogTitle>
            <Badge variant="outline" className="font-normal">
              {room.type}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {room.location}
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full overflow-hidden rounded-md sm:h-80">
          <Image
            src={room.thumbnail || "/placeholder.svg?height=400&width=600&query=hotel+room"}
            alt={room.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute right-2 top-2">
            <Badge variant={room.availability ? "default" : "destructive"}>
              {room.availability ? "Available" : "Booked"}
            </Badge>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          {/* Description Section */}
          <div>
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>

          {/* Room Details Section */}
          <div>
            <h3 className="mb-2 font-medium">Room Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Max {room.max_guests} guests</span>
              </li>
              <li className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span>{formatVND(room.price_per_night)} per night</span>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <RoomServices roomId={room.room_id} />
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleBookNow} disabled={!room.availability} className="w-full sm:w-auto">
            {room.availability ? "Book Now" : "Not Available"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
