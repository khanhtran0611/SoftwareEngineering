"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import RoomCard from "@/components/room-card"
import RoomDetailsModal from "@/components/room-details-modal"
import { getHotelRooms } from "@/lib/rooms"
import type { Room } from "@/types/room"

type RoomCarouselProps = {
  hotelId: number
}

export default function RoomCarousel({ hotelId }: RoomCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true)
        const data = await getHotelRooms(hotelId)
        setRooms(data)
      } catch (error) {
        console.error('Error fetching hotel rooms:', error)
        setRooms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [hotelId])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" })
    }
  }

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (isLoading) {
    return <div>Loading rooms...</div>
  }

  if (rooms.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Available Rooms</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {rooms.map((room) => (
          <div key={room.room_id} className="min-w-[300px] max-w-[300px] flex-shrink-0 snap-start">
            <RoomCard room={room} onViewDetails={handleViewDetails} />
          </div>
        ))}
      </div>

      <RoomDetailsModal room={selectedRoom} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
