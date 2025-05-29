"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Users, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Room } from "@/types/room"
import { formatVND } from "@/lib/currency"

type RoomCardProps = {
  room: Room
  onViewDetails: (room: Room) => void
}

export default function RoomCard({ room, onViewDetails }: RoomCardProps) {
  const router = useRouter()

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    if (room.availability) {
      router.push(`/dashboard/booking/${room.room_id}`)
    }
  }

  return (
    <Card
      className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onViewDetails(room)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={room.thumbnail || "/placeholder.svg?height=300&width=500&query=hotel+room"}
          alt={room.name}
          fill
          className="object-cover"
        />
        <div className="absolute right-2 top-2">
          <Badge variant={room.availability ? "default" : "destructive"}>
            {room.availability ? "Available" : "Booked"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold">{room.name}</h3>
          <Badge variant="outline" className="font-normal">
            {room.type}
          </Badge>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">{room.location}</p>
        <p className="line-clamp-2 text-sm">{room.description}</p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Max {room.max_guests} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span>{formatVND(room.price_per_night)}/night</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <Button onClick={handleBookNow} disabled={!room.availability} className="w-full">
          {room.availability ? "Book Now" : "Not Available"}
        </Button>
      </CardFooter>
    </Card>
  )
}
